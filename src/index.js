require("./stylesheets/main.less");

var settings = require("./settings");
var packageTemplate = require("./templates/package.html");

var Q = codebox.require("q");
var _ = codebox.require("hr.utils");
var axios = require("axios");
var commands = codebox.require("core/commands");
var dialogs = codebox.require("utils/dialogs");
var packages = codebox.require("core/packages");
var rpc = codebox.require("core/rpc");
var hash = codebox.require("utils/hash");

// Return packages from repository
var listFromRepository = function() {
    var p = Q(axios.get("https://api.github.com/repos/"+settings.data.get("repository")+"/readme"))
    .then(function(response) {
        return hash.atob(response.data.content);
    })
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
    });

    return codebox.statusbar.loading(p, {
        prefix: "Installing package"
    })
    .then(function() {
        return dialogs.alert("Package '"+url+"' is now installed.")
    })
    .fail(dialogs.error);
};

// Uninstall a package
var uninstallPackage = function(name) {
    var p = rpc.execute("packages/uninstall", {
        'name': name
    });

    return codebox.statusbar.loading(p, {
        prefix: "Removing package"
    })
    .then(function() {
        return dialogs.alert("This package will be fully removed once you restart Codebox.")
    })
    .fail(dialogs.error);
};

// List packages
commands.register({
    id: "package.list.all",
    title: "Package Control: List Packages",
    run: function() {
        return dialogs.list(packages, {
            template: packageTemplate
        });
    }
});

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
        .post("get", ["repository"])
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
        .post("get", ["name"])
        .then(uninstallPackage);
    }
});
