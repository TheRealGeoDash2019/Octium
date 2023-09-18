export default function() {
    let eventsHandlers = [];

    const noop = function() {};

    const addListener = function(callback = noop) {
        if (callback.toString() !== noop.toString()) {
            eventsHandlers.push(callback);
        }
        return;
    }

    const hasListener = function(callback = noop) {
        if (callback.toString()) {
            return !!eventsHandlers.find(e => (e.toString() === callback.toString()));
        } else {
            return false;
        }
    }

    const hasListeners = function() {
        return (eventsHandlers.length > 0);
    }

    const removeListener = function(callback = noop) {
        const result = eventsHandlers.find(e => (e.toString() === callback.toString()));
        if (result) {
            eventsHandlers = eventsHandlers.filter(e => (e.toString() === callback.toString()));
            return;
        } else {
            return;
        }
    }

    const dispatch = function(..._) {
        eventsHandlers.forEach(e => {
            e.call(this, ..._);
        });
        return;
    }

    return Object.freeze({
        addListener,
        dispatch,
        hasListener,
        hasListeners,
        removeListener
    });
}