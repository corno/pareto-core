# attention
In a project, packages can only interact properly if they use the same version of this package (unless the API did not change)

So, be very aware: if you make any changes to the types in this package and publish it, projects will break until all included packages are updated to the latest version of this one.

Specifically the lib-pareto-test package and its dependencies need to be fixed. However these packages cannot be tested until lib-pareto-test is updated. A nice catch 22.
Current best approach:
-disable all tests, and publish without tests, then enable tests again.

# validating that a project only uses one version of this package
in the root dir:
node ./scripts/scripts/validateSingleVersionOfParetoTypesPackage.js ./typescript/pub/

# publishing
just use one of the 'publish' scripts