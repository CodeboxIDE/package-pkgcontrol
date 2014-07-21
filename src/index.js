define([
    "src/settings",
    "text!src/templates/package.html",
    "less!src/stylesheets/main.less"
], function(settings, packageTemplate) {
    var _ = codebox.require("hr/utils");
    var hr = codebox.require("hr/hr");
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");
    var packages = codebox.require("core/packages");
    var rpc = codebox.require("core/rpc");
    var hash = codebox.require("utils/hash");

    // Return packages from repository
    var listFromRepository = function() {
        var p = hr.Requests.getJSON("https://api.github.com/repos/"+settings.data.get("repository")+"/readme")
        .get("content")
        .then(hash.atob)
        .then(function(content) {
            return _.chain(content.split("\n"))
            .map(function(line) {
                var parts = _.compact(line.split("|"));
                if (parts.length != 4) return null;

                return {
                    'name': parts[0].trim(),
                    'description': parts[1].trim(),
                    'author': parts[2].trim(),
                    'repository': parts[3].trim()
                };
            })
            .compact()
            .slice(2)
            .value()
        });

        return codebox.statusbar.loading(p, {
            prefix: "Loading repository"
        });
    };

    // Install a package
    var installPackage = function(url) {
        var p = rpc.execute("packages/install", {
            'url': url
        })
        .then(function() {
            return dialogs.alert("This package will be fully operational once you reopen Codebox.")
        });

        return codebox.statusbar.loading(p, {
            prefix: "Installing package"
        });
    };

    // Install a package from repository
    commands.register({
        id: "package.install",
        title: "Package Control: Install Package",
        run: function() {
            return listFromRepository()
            .then(function(packages) {
                return dialogs.list(packages, {
                    template: packageTemplate,
                    placeholder: "Install a package"
                });
            })
            .get("repository")
            .then(installPackage);
        }
    });

    // Uninstall a package
    commands.register({
        id: "package.uninstall",
        title: "Package Control: Remove Package",
        run: function() {
            return dialogs.list(packages, {
                template: packageTemplate,
                placeholder: "Remove a package"
            })
            .then(function(pkg) {

            });
        }
    });
});