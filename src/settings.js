define(function() {
    return codebox.settings.schema("packages",
        {
            "title": "Package Control",
            "type": "object",
            "properties": {
                "repository": {
                    "description": "Repository",
                    "type": "string",
                    "default": "CodeboxIDE/packages"
                }
            }
        }
    );
});