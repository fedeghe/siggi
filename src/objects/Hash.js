import _Object from './../protos/Object'
import _Class from './Class'
import _Enumerable from './Enumerable'

const Hash = _Class.create(_Enumerable, (function() {
    const toObject = o => _Object.clone(o._object);

    function initialize(object) {
        this._object = _Object.isHash(object) ?
            toObject(object) :
            _Object.clone(object);
    }
    return {
        initialize,
        toObject,
        toTemplateReplacements: toObject
    };
})());

export default Hash