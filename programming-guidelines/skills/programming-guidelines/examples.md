# Examples for Python Clean Code

This file contains examples demonstrating how to apply coding guidelines

## Example 1: Files and Directories

### Bad Usage:
```
Src/
    Main-Code/
        main.py
        my-resource.py
        my-service.py
        my-api.py
        dependencies.py
```

### Good Usage:
```
src/
    tests/
    resources/
        [resource_name].py
    services/
        [service_name].py
    api/
        v1/
            [router_name]/
                router.py
                dependencies.py
```

## Example 2: Classes


### Bad Usage:
```python

# This is a good specialized class
class specialized_class([ExtendedClass]):
    def __init__(parent, CONFIG=None, tester=1, *args, **kwargs):
        self.parent = parent
        self.CONFIG = CONFIG
        self.tester = min(2, tester)
        self.super(*args, **kwargs)
```

## Good Usage:
```python
class snake_case_name([ExtendedClass]):
    def __init__(master, slave, use_cases, *args, **kwargs):
        # This class specialized in X,Y,Z and has the following args:
        # master - Responsible on the component
        # slave - The component that is used
        # use_cases - The number of use cases to have
        self.master = master
        self.slave = slave
        self.use_cases = min(2, use_cases)
        self.super(*args, **kwargs)
```