#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# Compatibility shim for Python 3.12+ where pkg_resources was removed from standard library
try:
    import pkg_resources
except ImportError:
    try:
        from importlib.metadata import version as _ver
        class _Pkg:
            def __init__(self, name):
                try:
                    self.version = _ver(name)
                except Exception:
                    self.version = "1.4.1"
        class _PkgResourcesShim:
            @staticmethod
            def require(name):
                return [_Pkg(name)]
        sys.modules['pkg_resources'] = _PkgResourcesShim()
    except Exception:
        pass


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'studio_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
