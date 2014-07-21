define(function() {
    return codebox.settings.schema("packages",
        {
            "title": "Package Control",
            "type": "object",
            "properties": {
                "repository": {
                    "type": "string",
                    "default": "CodeboxIDE/packages"
                }
            }
        }
    );
});