(function () {
    // Go play balls if no support getComputedStyle()
    if (!window.getComputedStyle) return;

    var _style = getComputedStyle(document.documentElement);

    function isPropertySupported(prop) {
        return typeof _style[prop] === 'string';
    }

    function getPrefixedProperty(prop) {
        var prefixedProp = '';
        ['webkit', 'Moz', 'ms', 'O'].forEach(function (prefix) {
            var Prop = prop[0].toUpperCase() + prop.substr(1);
            if (isPropertySupported(prefix + Prop)) {
                prefixedProp = prefix + Prop;
            }
        });
        return prefixedProp;
    }

    function prefixProperty(prop) {
        // Do nothing if already supported
        if (isPropertySupported(prop)) return;

        var prefixedProperty = getPrefixedProperty(prop);

        if (!prefixedProperty) return;
        console.log(prefixedProperty);
        Object.defineProperty(CSSStyleDeclaration.prototype, prop, {
            get: function () {
                return this[prefixedProperty];
            },
            set: function (newValue) {
                this[prefixedProperty] = newValue;
            }
        });
    }

    function getSpecialProperty(prefix) {
        return Array.prototype.slice.apply(_style)
            .filter(function (prop) {
                // �ҵ����е�����
                return prop.indexOf(prefix) > -1;
            })
            .map(function (prop) {
                return prop
                    .replace('-' + prefix + '-', '')
                    .replace(/-(.)/gi, function (_, $1) {
                        return $1.toUpperCase();
                    });
            });
    }

    getSpecialProperty('webkit').forEach(prefixProperty);
    getSpecialProperty('moz').forEach(prefixProperty);
    getSpecialProperty('ms').forEach(prefixProperty);
    getSpecialProperty('o').forEach(prefixProperty);
})();