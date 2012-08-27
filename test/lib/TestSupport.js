/*!
 * Cloudeo UI Library
 * http://www.cloudeo.tv
 *
 * Copyright (C) SayMama Ltd 2012
 * Released under the MIT license.
 */

/**
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 16-03-2012 20:04
 */

(function ($, g, CDO) {
  'use strict';
  function TestSupport() {

  }

  TestSupport.prototype.mockModule = function (name, mockInstance) {
    this['old_' + name] = window[name];
    window[name] = mockInstance;
    this.lastMockCallArgs = [];
  };

  TestSupport.prototype.stubGlobals = function (stubs) {
    var self = this;
    this.stubbed = [];
    for (var k in stubs) {
      if (Object.prototype.hasOwnProperty.call(stubs, k)) {
        var v = stubs[k];
        self.mockModule(k, v);
        self['mock' + k] = v;
        self.stubbed.push(k);
      }
    }
  };

  TestSupport.prototype.unstubAll = function () {
    for (var k in this.stubbed) {
      if (this.stubbed.hasOwnProperty(k)) {
        this.unmockModule(this.stubbed[k]);
      }
    }
    this.stubbed = [];
  };

  TestSupport.prototype.unmockModule = function (name) {
    window[name] = this['old_' + name];
  };

  TestSupport.prototype.mockCall = function () {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    this.lastMockCallArgs.push(args);
  };

  TestSupport.prototype.getBoundCallHandler = function () {
    var self = this;
    return function (a, b, c, d, e, f, g, h, i, j) {
      return self.mockCall(a, b, c, d, e, f, g, h, i, j);
    };
  };

  TestSupport.addTests = function (clazz) {
    for (var k in clazz.tests) {
      if (Object.prototype.hasOwnProperty.call(clazz.tests, k)) {
        var v = clazz.tests[k];
        clazz.prototype[k] = wrapForNiceExceptions(v, k);
      }
    }
  };

  TestSupport.amend = function (clazz) {
    amendClass(clazz, TestSupport);
  };

  function amendClass(child, parent) {
//  var sourceInstance = new TestSupport();
    for (var key in parent.prototype) {
      if (Object.prototype.hasOwnProperty.call(parent.prototype, key)) {
        child.prototype[key] = parent.prototype[key];
      }
    }
  }

  function TestException(message, testName) {
    try {
      g.fail();
    } catch (e) {
      for (var k in e) {
        if (e.hasOwnProperty(k)) {
          this[k] = e[k];
        }
      }
    }
    this.name = 'TestException';
    this.message = "Got exception in test: " + testName + ':\n' + message;
  }

  function wrapForNiceExceptions(callable, name) {
    return function (q) {
      try {
        callable.call(this, q);
      } catch (e) {
        if (e.constructor === String) {
          throw new TestException(e, name);
        }
        throw e;
      }
    };
  }

  g.TestSupport = TestSupport;

}(jQuery, window, window.CDO));
