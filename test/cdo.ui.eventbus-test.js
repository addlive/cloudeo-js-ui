/*!
 * Cloudeo UI Library
 * http://www.cloudeo.tv
 *
 * Copyrit (C) SayMama Ltd 2012
 * Released under the MIT license.
 */


/**
 * Unit test for the EventBus module.
 */
(function ($, g, CDO) {
  'use strict';
  var testCase = g.TestCase,
      EventBus = CDO.EventBus,
      assertTrue = g.assertTrue,
      assertFalse = g.assertFalse,
      TestSupport = g.TestSupport;

  var EventBusTest = testCase("EventBusTest");
  TestSupport.amend(EventBusTest);


  function MockEvent() {
    this.type = MockEvent.type;
  }

  MockEvent.type = 'MockEvent';


  function testPubSub() {
    var dispatched = false;
    EventBus.subscribe(MockEvent.type, function (event) {
      if (event.type.match(/^MockEvent.*/)) {
        dispatched = true;
      } else {
        assertTrue('Invalid event type: ' + event.type, false);
      }
    });
    EventBus.publish(new MockEvent());
    assertTrue('Event not dispatched', dispatched);
  }


  function testUnsubscribe() {
    var dispatched = false;
    var eventHandler = function (event) {
      if (event.type === 'MockEvent') {
        dispatched = true;
      } else {
        assertTrue('Invalid event type: ' + event.type, false);
      }
    };
    EventBus.subscribe('MockEvent', eventHandler);
    EventBus.publish(new MockEvent());
    assertTrue('Event not dispatched', dispatched);
    dispatched = false;
    EventBus.unsubscribe('MockEvent', eventHandler);
    EventBus.publish(new MockEvent());
    assertFalse("Event handled while it shouldn't", dispatched);
  }

  function TestEventHandlerClass() {
    var self = this;
    this.handlinunctor = function (e) {
      self.doHandle(e);
    };
    this.eventHandled = false;
  }

  TestEventHandlerClass.prototype.start = function() {
    var self = this;
    EventBus.subscribe('MockEvent', this.handlinunctor);
  };

  TestEventHandlerClass.prototype.stop = function () {
    EventBus.unsubscribe('MockEvent', this.handlinunctor);
  };

  TestEventHandlerClass.prototype.doHandle = function (e) {
    this.eventHandled = true;
  };

  function testClassHandlerSimple() {
    var handler1 = new TestEventHandlerClass();
    handler1.start();
    EventBus.publish(new MockEvent());
    assertTrue(handler1.eventHandled);
    handler1.stop();
    handler1.eventHandled = false;
    EventBus.publish(new MockEvent());
    assertFalse(handler1.eventHandled);
  }

  function testClassHandler2Instances() {
    var handler1 = new TestEventHandlerClass();
    var handler2 = new TestEventHandlerClass();
    handler1.start();
    EventBus.publish(new MockEvent());
    assertTrue(handler1.eventHandled);
    assertFalse(handler2.eventHandled);
    handler1.stop();
    handler2.start();
    handler1.eventHandled = false;
    EventBus.publish(new MockEvent());
    assertFalse(handler1.eventHandled);
    assertTrue(handler2.eventHandled);
  }

  EventBusTest.tests = {
    testPubSub:testPubSub,
    testUnsubscribe:testUnsubscribe,
    testClassHandlerSimple:testClassHandlerSimple,
    testClassHandler2Instances:testClassHandler2Instances
  };

  TestSupport.addTests(EventBusTest);
  g.EventBusTest = EventBusTest;

}(jQuery, window, CDO));