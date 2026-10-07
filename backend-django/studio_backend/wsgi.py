"""
WSGI config for studio_backend project.
"""

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

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'studio_backend.settings')
application = get_wsgi_application()
