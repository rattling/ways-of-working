# PHP stack

**Today:** <!-- PHP version, framework if any, database, where it runs -->
**Moving to:** <!-- e.g. a supported PHP 8.x, Composer autoloading throughout, containers for local development and CI. Framework adoption only by ADR. -->

A PHP version past the end of security support ([php.net/supported-versions](https://www.php.net/supported-versions.php)) makes the upgrade a security item, not polish.

| Concern | Tool | In the gate as |
|---|---|---|
| Formatting | PHP-CS-Fixer (PSR-12) | `php-cs-fixer fix --dry-run --diff` |
| Static analysis | PHPStan, a level per repo, with a baseline that only shrinks | `phpstan analyse` |
| Security analysis | Psalm `--taint-analysis`, or Semgrep's PHP rules | Required check |
| Upgrades | Rector, one rule set per PR, with tests as the safety net | Not in the gate |
| Tests | PHPUnit; integration tests against MySQL in a container | `phpunit` |
| Dependencies | `composer audit`; Dependabot for Composer | `composer audit` |

## Rules

- `declare(strict_types=1);` in new files.
- PDO with prepared statements only.
- New code is autoloaded classes: no new `include` for logic, no new globals.
- Escape output with one helper (`htmlspecialchars` with `ENT_QUOTES` and UTF-8), never by hand.
- `php.ini-production` settings in every environment except local: errors are logged, never displayed.

## Gotchas

- The `php:7.4` Docker images are on Debian bullseye, whose apt archive has moved. Install extensions with `docker-php-ext-install` and fetch dependencies in a separate Composer stage, not through apt.
