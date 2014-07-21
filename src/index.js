define([
    "src/settings",
    "text!src/templates/package.html",
    "less!src/stylesheets/main.less"
], function(settings, packageTemplate) {
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");
    var packages = codebox.require("core/packages");

    // Install a package from repository
    commands.register({
        id: "package.install",
        title: "Package Control: Install Package",
        run: function() {
            /*return
            .then(function(packages) {
                return dialogs.list(commands, {
                    template: packageTemplate
                });
            })
            .then(function(command) {
                //return command.run();
            });*/
        }
    });

    // Uninstall a package
    commands.register({
        id: "package.uninstall",
        title: "Package Control: Remove Package",
        run: function() {
            return dialogs.list(packages, {
                template: packageTemplate
            })
            .then(function(pkg) {

            });
        }
    });
});