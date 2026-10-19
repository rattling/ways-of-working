# .NET stack

**Today:** <!-- .NET version, IDE, source control, database, hosting -->
**Moving to:** <!-- e.g. .NET Framework 4.8 for existing code (4.6.x and earlier are out of support, and their code builds unchanged on 4.8); modern .NET for new services. Porting existing code only part by part, behind a stable contract, by ADR. -->

| Concern | Tool | In the gate as |
|---|---|---|
| Style | `.editorconfig` in the repo | Build warnings |
| Analysis | Roslyn analyzers (`Microsoft.CodeAnalysis.NetAnalyzers` package); warnings as errors in new projects, a baseline in old ones | MSBuild |
| Security analysis | CodeQL for C# (needs a build, so a Windows runner) | Required check |
| Tests | One framework per repo (MSTest, NUnit or xUnit, recorded in an ADR); integration tests against SQL Server LocalDB | `vstest` / `dotnet test` |
| Dependencies | NuGet audit; Dependabot for NuGet. Move `packages.config` to `PackageReference` as projects are touched | Restore warnings as errors |

## Rules

- Parameterised SQL or an ORM; never concatenated SQL.
- `async` all the way down or not at all: no `.Result` or `.Wait()` on tasks.
- Configuration from `Web.config` transforms or environment settings, with no secrets committed. Secrets come from the host.
- `customErrors` on outside local development.

## Gotchas

- .NET Framework builds need Windows, so CI uses `windows-latest`. Linux runners can't build it.
- Old-style `.csproj` files don't support every `dotnet` CLI command. Use MSBuild and `vstest.console` until a project is SDK-style.
