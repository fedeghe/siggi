import { isObject } from './../core/checkers'
import _Class from './Class'

import _Hash from './Hash'
import _String from './../protos/String'

var Template = _Class.create({
    initialize: function(template, pattern) {
        this.template = template.toString();
        this.pattern = pattern || Template.Pattern;
    },

    evaluate: function(object) {
        if (object && isObject(object))
            object = _Hash.toTemplateReplacements(object);

        return _String.gsub(this.template, this.pattern, function(match) {
            if (object == null) return (match[1] + '');

            var before = match[1] || '';
            if (before == '\\') return match[2];

            var ctx = object,
                expr = match[3],
                pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

            match = pattern.exec(expr);
            if (match == null) return before;

            while (match != null) {
                
                var comp = _String.startsWith(match[1], '[')
                    ? match[2].replace(/\\\\]/g, ']')
                    : match[1];
                ctx = ctx[comp];
                if (null == ctx || '' == match[3]) break;
                expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
                match = pattern.exec(expr);
            }

            return before + _String.interpret(ctx);
        });
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

export default Template