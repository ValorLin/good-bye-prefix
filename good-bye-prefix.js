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

    function goodByPrefix(root, compareRoot) {
        compareRoot = compareRoot || root;
        return function (property) {
            // Do nothing if already supported
            if (isPropertySupported(compareRoot, property)) return;

            var prefixedProperty = getPrefixedProperty(compareRoot, property);

            if (!prefixedProperty) return;
            setAlia(root, property, prefixedProperty);
        };
    }

    function setAlia(root, property, prefixedProperty) {
        console.log('setAlia', root, property, prefixedProperty);
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

    function getSpecialObjectProperty(properties, prefix) {
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

    function goodByPrefixForObject(root, compareRoot) {
        var properties = [];
        for (var key in root) {
            properties.push(key);
        }
        getSpecialObjectProperty(properties, 'webkit').forEach(goodByPrefix(root, compareRoot));
        getSpecialObjectProperty(properties, 'moz').forEach(goodByPrefix(root, compareRoot));
        getSpecialObjectProperty(properties, 'ms').forEach(goodByPrefix(root, compareRoot));
        getSpecialObjectProperty(properties, 'o').forEach(goodByPrefix(root, compareRoot));
    }

    function goodByePrefixForStyle() {
        var styleProperties = Array.prototype.slice.apply(_style);
        getSpecialCSSProperty(styleProperties, 'webkit').forEach(goodByPrefix(CSSStyleDeclaration.prototype, _style));
        getSpecialCSSProperty(styleProperties, 'moz').forEach(goodByPrefix(CSSStyleDeclaration.prototype, _style));
        getSpecialCSSProperty(styleProperties, 'ms').forEach(goodByPrefix(CSSStyleDeclaration.prototype, _style));
        getSpecialCSSProperty(styleProperties, 'o').forEach(goodByPrefix(CSSStyleDeclaration.prototype, _style));
    }

    goodByePrefixForStyle();
    goodByPrefixForObject(document);
    goodByPrefixForObject(window);
    goodByPrefixForObject(navigator);
})();