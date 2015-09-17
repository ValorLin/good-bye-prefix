(function () {
    // Go play balls if no support getComputedStyle()
    if (!window.getComputedStyle) return;

    var _style = getComputedStyle(document.documentElement);

    function isPropertySupported(root, prop) {
        return prop in root;
    }

    function getPrefixedProperty(root, prop) {
        var prefixedProp = '';
        ['webkit', 'Moz', 'ms', 'O'].forEach(function (prefix) {
            var Prop = prop[0].toUpperCase() + prop.substr(1);
            if (isPropertySupported(root, prefix + Prop)) {
                prefixedProp = prefix + Prop;
            }
        });
        return prefixedProp;
    }

    function goodByPrefix(root) {
        return function (property) {
            // Do nothing if already supported
            if (isPropertySupported(root, property)) return;

            var prefixedProperty = getPrefixedProperty(root, property);

            if (!prefixedProperty) return;
            setAlia(root, property, prefixedProperty);
        };
    }

    function setAlia(root, property, prefixedProperty) {
        Object.defineProperty(root, property, {
            get: function () {
                return this[prefixedProperty];
            },
            set: function (newValue) {
                this[prefixedProperty] = newValue;
            }
        });
    }

    function getSpecialCSSProperty(properties, prefix) {
        return properties
            .filter(function (prop) {
                return prop.indexOf('-' + prefix) === 0;
            })
            .map(function (prop) {
                return prop
                    .replace('-' + prefix + '-', '')
                    .replace(/-(.)/gi, function (_, $1) {
                        return $1.toUpperCase();
                    });
            });
    }

    function getSpecialDocumentProperty(properties, prefix) {
        return properties
            .filter(function (prop) {
                return prop.indexOf(prefix) === 0;
            })
            .map(function (prop) {
                return prop
                    .replace(new RegExp('(' + prefix + ')(.)'), function (_, $1, $2) {
                        return $2.toLowerCase();
                    });
            });
    }

    var styleProperties = Array.prototype.slice.apply(_style);
    getSpecialCSSProperty(styleProperties, 'webkit').forEach(goodByPrefix(_style));
    getSpecialCSSProperty(styleProperties, 'moz').forEach(goodByPrefix(_style));
    getSpecialCSSProperty(styleProperties, 'ms').forEach(goodByPrefix(_style));
    getSpecialCSSProperty(styleProperties, 'o').forEach(goodByPrefix(_style));

    var documentProperties = [];
    for (var key in document) {
        documentProperties.push(key);
    }
    getSpecialDocumentProperty(documentProperties, 'webkit').forEach(goodByPrefix(document));
    getSpecialDocumentProperty(documentProperties, 'moz').forEach(goodByPrefix(document));
    getSpecialDocumentProperty(documentProperties, 'ms').forEach(goodByPrefix(document));
    getSpecialDocumentProperty(documentProperties, 'o').forEach(goodByPrefix(document));
})();