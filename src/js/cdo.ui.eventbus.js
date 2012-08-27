/*!
 * Cloudeo UI Library
 * http://www.cloudeo.tv
 *
 * Copyright (C) SayMama Ltd 2012
 * Released under the MIT license.
 */

/**
 * Module responsible for realization of event-driven architecture.
 * It allows publish-subscribe approach to event processing. Any module may
 * subscribe as a receiver of any event. Also any module may publish any type
 * of event.
 *
 * It provides 2 simple methods: publish and subscribe in order to
 * accomplish this task.
 *
 * @author Tadeusz Kozak
 * @date 08/27/2012
 */
(function ($, w, CDO) {
  'use strict';
  /**
   * ===================================================================
   * Scope constants
   * ===================================================================
   */

  var PRIORITIES = {
        TOP:0,
        NORMAL:1,
        LOW:2
      },

      PRIORITIES_ORDER = [PRIORITIES.TOP, PRIORITIES.NORMAL, PRIORITIES.LOW],
      /**
       * Object  to be wrapped by jQuery for events dispatching.
       */
      eventRouters = {};
      eventRouters[PRIORITIES.TOP] = $({});
      eventRouters[PRIORITIES.NORMAL] = $({});
      eventRouters[PRIORITIES.LOW] = $({});

  /**
   * ===================================================================
   * Public API
   * ===================================================================
   */

  /**
   * Subscribes given handler to be notified about all events of given type.
   *
   * @param eventType type of event to be subscribed
   * @param handler   handler to be triggered on given event
   */
  function subscribe(eventType, handler, priority) {

    if (priority === undefined) {
      priority = PRIORITIES.NORMAL;
    }
    CDO._logd('Subscribing listener on events: ' + eventType);
    eventRouters[priority].bind(eventType, handler);
  }

  function unsubscribe(eventType, handler) {
    CDO._logd('Unsubscribing listener on events: ' + eventType);
    $.each(PRIORITIES_ORDER, function (k, v) {
      eventRouters[v].unbind(eventType, handler);
    });
  }

  function publish(event) {
    _validateEvent(event);
    var clone = $.extend({}, event);
    CDO._logd('Publishing event of type: ' + event.type);
    $.each(PRIORITIES_ORDER, function (k, v) {
      eventRouters[v].trigger(clone);
    });
  }

  //noinspection UnnecessaryLocalVariableJS
  CDO.EventBus = {
    name:'EventBus',
    PRIORITIES:PRIORITIES,
    subscribe:subscribe,
    unsubscribe:unsubscribe,
    publish:publish
  };

  /**
   * ===================================================================
   * Private helpers, utilities
   * ===================================================================
   */

  function _validateEvent(e) {
    if (typeof e.type !== 'string' || !e.type.length) {
      throw new CDO.CloudeoException('Invalid event - type is undefined',
                                     CDO.ErrorCodes.Logic.INVALID_ARGUMENT);
    }
  }


}(jQuery, window, window.CDO));
