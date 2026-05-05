"""
ATK2 — Dependency confusion attack simulation (safe, local, no real registry access).

The model here simulates two registries:
  - internal (trusted corporate source)
  - public (untrusted internet source)

If resolver precedence is misconfigured, a same-name public package can win.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Final, Optional


@dataclass(frozen=True)
class RegistryPackage:
    name: str
    version: str
    source: str  # internal | public
    trusted: bool
    publisher: str
    simulated_effect: str


INTERNAL_REGISTRY: Final[dict[str, RegistryPackage]] = {
    "corp-internal-ledger-api": RegistryPackage(
        name="corp-internal-ledger-api",
        version="1.4.2",
        source="internal",
        trusted=True,
        publisher="corp-security-platform",
        simulated_effect="Normal internal ledger synchronization helper.",
    ),
    "corp-internal-ledger-sync": RegistryPackage(
        name="corp-internal-ledger-sync",
        version="2.0.1",
        source="internal",
        trusted=True,
        publisher="corp-finops",
        simulated_effect="Normal internal reconciliation batch helper.",
    ),
}

PUBLIC_REGISTRY: Final[dict[str, RegistryPackage]] = {
    # Same names as internal packages to simulate confusion attempts.
    "corp-internal-ledger-api": RegistryPackage(
        name="corp-internal-ledger-api",
        version="9.9.9",
        source="public",
        trusted=False,
        publisher="unknown-publisher",
        simulated_effect=(
            "[DEMO ONLY] Public lookalike package could execute install hooks and "
            "collect environment and repository metadata."
        ),
    ),
    "corp-internal-ledger-sync": RegistryPackage(
        name="corp-internal-ledger-sync",
        version="7.7.0",
        source="public",
        trusted=False,
        publisher="squatted-maintainer",
        simulated_effect=(
            "[DEMO ONLY] Public twin package could run malicious code path in CI."
        ),
    ),
}


@dataclass(frozen=True)
class ResolverPolicy:
    prefer_internal: bool = True
    allow_public_fallback_for_internal_names: bool = False
    enforce_internal_namespace_block: bool = True


@dataclass
class ResolutionResult:
    package_name: str
    requested_version: str
    outcome: str  # safe_internal | blocked_policy | confused_public | not_found
    resolved: Optional[RegistryPackage]
    attacker_success: bool
    reason: str


def is_internal_style_name(name: str) -> bool:
    return name.startswith("corp-internal-")


def simulate_resolution(
    package_name: str,
    requested_version: str,
    policy: Optional[ResolverPolicy] = None,
) -> ResolutionResult:
    policy = policy or ResolverPolicy()
    internal = INTERNAL_REGISTRY.get(package_name)
    public = PUBLIC_REGISTRY.get(package_name)
    internal_name = is_internal_style_name(package_name)

    if internal_name and policy.enforce_internal_namespace_block and internal is None and public is not None:
        return ResolutionResult(
            package_name=package_name,
            requested_version=requested_version,
            outcome="blocked_policy",
            resolved=None,
            attacker_success=False,
            reason="Internal namespace policy blocked unknown internal-style package from public registry.",
        )

    if policy.prefer_internal and internal is not None:
        return ResolutionResult(
            package_name=package_name,
            requested_version=requested_version,
            outcome="safe_internal",
            resolved=internal,
            attacker_success=False,
            reason="Resolver preferred internal registry package.",
        )

    if public is not None and (
        not internal_name or policy.allow_public_fallback_for_internal_names or internal is None
    ):
        return ResolutionResult(
            package_name=package_name,
            requested_version=requested_version,
            outcome="confused_public",
            resolved=public,
            attacker_success=True,
            reason="Public package resolved for internal-style dependency name.",
        )

    if internal is not None:
        return ResolutionResult(
            package_name=package_name,
            requested_version=requested_version,
            outcome="safe_internal",
            resolved=internal,
            attacker_success=False,
            reason="Internal package resolved.",
        )

    return ResolutionResult(
        package_name=package_name,
        requested_version=requested_version,
        outcome="not_found",
        resolved=None,
        attacker_success=False,
        reason="Package not found in simulated registries.",
    )


def scan_manifest_for_dependency_confusion(
    dependencies: dict[str, str],
    policy: Optional[ResolverPolicy] = None,
) -> dict[str, Any]:
    policy = policy or ResolverPolicy()
    findings: list[dict[str, Any]] = []

    for name, version in dependencies.items():
        if not is_internal_style_name(name):
            continue
        result = simulate_resolution(name, version, policy)
        severity = "high" if result.outcome == "confused_public" else "medium"
        findings.append(
            {
                "package": name,
                "requested_version": version,
                "outcome": result.outcome,
                "attacker_success": result.attacker_success,
                "severity": severity,
                "reason": result.reason,
                "resolved_source": result.resolved.source if result.resolved else None,
                "resolved_version": result.resolved.version if result.resolved else None,
                "simulated_effect": result.resolved.simulated_effect if result.resolved else None,
            }
        )

    return {
        "scanned": len(dependencies),
        "internal_style_dependencies": sum(1 for n in dependencies if is_internal_style_name(n)),
        "findings_count": len(findings),
        "findings": findings,
    }


def to_siem_event(finding: dict[str, Any], source: str = "demo-site") -> dict[str, Any]:
    return {
        "event_id": f"ATK2-{finding['package']}",
        "attack_type": "dependency_confusion",
        "severity": finding["severity"],
        "source": source,
        "package": finding["package"],
        "requested_version": finding["requested_version"],
        "resolved_source": finding["resolved_source"],
        "resolved_version": finding["resolved_version"],
        "attacker_success": finding["attacker_success"],
        "note": finding["reason"],
        "simulated_effect": finding["simulated_effect"],
        "recommendation": (
            "Pin private index precedence, block internal namespace from public sources, "
            "and enforce trusted package provenance."
        ),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
