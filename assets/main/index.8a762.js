window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Geometry: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "178a0MgoTdL7K8Mv8+ykIwF", "Geometry");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EOrientation = exports.VisibilityEvent = exports.Segment = exports.SegmentComparator = exports.AngleComparator = void 0;
    var Heap_1 = require("./Heap");
    var AngleComparator = function() {
      function AngleComparator(o) {
        this._o = o;
      }
      AngleComparator.prototype.Cmp = function(a, b) {
        var eps = 1e-5;
        var o = this._o;
        var axDelta = a.x - o.x;
        axDelta = Math.abs(axDelta) <= eps ? 0 : axDelta < 0 ? -1 : 1;
        var bxDelta = b.x - o.x;
        bxDelta = Math.abs(bxDelta) <= eps ? 0 : bxDelta < 0 ? -1 : 1;
        if (axDelta !== bxDelta && (-1 === axDelta || -1 === bxDelta)) return bxDelta - axDelta;
        var ayDelta = a.y - o.y;
        var byDelta = b.y - o.y;
        if (0 === axDelta && 0 === bxDelta) {
          if (ayDelta >= 0 || byDelta >= 0) return byDelta - ayDelta;
          return ayDelta - byDelta;
        }
        axDelta = a.x - o.x;
        bxDelta = b.x - o.x;
        var cross = axDelta * byDelta - ayDelta * bxDelta;
        if (Math.abs(cross) <= eps) return bxDelta * bxDelta + byDelta * byDelta - (axDelta * axDelta + ayDelta * ayDelta);
        return cross;
      };
      return AngleComparator;
    }();
    exports.AngleComparator = AngleComparator;
    var SegmentComparator = function() {
      function SegmentComparator(o, segments) {
        this._o = o;
        this._segments = segments;
      }
      SegmentComparator.ApproxEqualVec2 = function(a, b) {
        var eps = SegmentComparator._epsilon;
        return Math.abs(a.x - b.x) <= eps && Math.abs(a.y - b.y) <= eps;
      };
      SegmentComparator.prototype.Cmp = function(sidx, sidy) {
        var x = this._segments[sidx];
        var y = this._segments[sidy];
        var a = x.a, b = x.b;
        var c = y.a, d = y.b;
        var o = this._o;
        var ApproxEqualVec2 = SegmentComparator.ApproxEqualVec2;
        if (ApproxEqualVec2(b, c) || ApproxEqualVec2(b, d)) {
          var tmp = a;
          a = b;
          b = tmp;
        }
        if (ApproxEqualVec2(a, d)) {
          var tmp = c;
          c = d;
          d = tmp;
        }
        var Orientation = Geometry.Orientation;
        if (ApproxEqualVec2(a, c)) {
          var oad = Orientation(o, a, d);
          var oab = Orientation(o, a, b);
          if (oad != oab || ApproxEqualVec2(b, d)) return 0;
          if (Orientation(a, b, d) != Orientation(a, b, o)) return -1;
          return 1;
        }
        var cda = Orientation(c, d, a);
        var cdb = Orientation(c, d, b);
        if (cda === EOrientation.COLLINEAR && cdb === EOrientation.COLLINEAR) return 0;
        if (cda === cdb || cda === EOrientation.COLLINEAR || cdb === EOrientation.COLLINEAR) {
          var cdo = Orientation(c, d, o);
          if (cdo === cda || cdo === cdb) return -1;
          return 1;
        }
        if (Orientation(a, b, o) !== Orientation(a, b, c)) return -1;
        return 1;
      };
      SegmentComparator._epsilon = 1e-5;
      return SegmentComparator;
    }();
    exports.SegmentComparator = SegmentComparator;
    var Segment = function() {
      function Segment(a, b) {
        this.a = a;
        this.b = b;
      }
      return Segment;
    }();
    exports.Segment = Segment;
    var EVisibilityEvent;
    (function(EVisibilityEvent) {
      EVisibilityEvent[EVisibilityEvent["START"] = 0] = "START";
      EVisibilityEvent[EVisibilityEvent["END"] = 1] = "END";
    })(EVisibilityEvent || (EVisibilityEvent = {}));
    var VisibilityEvent = function() {
      function VisibilityEvent(event, point, sid) {
        this.event = event;
        this.point = point;
        this.sid = sid;
      }
      return VisibilityEvent;
    }();
    exports.VisibilityEvent = VisibilityEvent;
    var EOrientation;
    (function(EOrientation) {
      EOrientation[EOrientation["RIGHT_TURN"] = -1] = "RIGHT_TURN";
      EOrientation[EOrientation["COLLINEAR"] = 0] = "COLLINEAR";
      EOrientation[EOrientation["LEFT_TURN"] = 1] = "LEFT_TURN";
    })(EOrientation = exports.EOrientation || (exports.EOrientation = {}));
    var Geometry = function() {
      function Geometry() {}
      Geometry.add = function(a, b) {
        return a + b;
      };
      Geometry.ApproxLessEqualNumber = function(x, y) {
        return x - y <= this._epsilon;
      };
      Geometry.ApproxGreatEqualNumber = function(x, y) {
        return x - y >= -this._epsilon;
      };
      Geometry.ApproxIsInRangeNumber = function(x, a, b) {
        return a - x <= this._epsilon && x - b <= this._epsilon;
      };
      Geometry.ApproxLessEqualPoint = function(p, q) {
        return p.x - q.x <= this._epsilon && p.y - q.y <= this._epsilon;
      };
      Geometry.ApproxGreatEqualPoint = function(p, q) {
        return p.x - q.x >= -this._epsilon && p.y - q.y >= -this._epsilon;
      };
      Geometry.ApproxIsInRangePoint = function(o, p, q) {
        var eps = this._epsilon;
        var ox = o.x, oy = o.y;
        var minx = Math.min(p.x, q.x);
        var maxx = Math.max(p.x, q.x);
        var miny = Math.min(p.y, q.y);
        var maxy = Math.max(p.y, q.y);
        return minx - ox <= eps && ox - maxx <= eps && miny - oy <= eps && oy - maxy <= eps;
      };
      Geometry.Cross = function(u, v) {
        return u.x * v.y - u.y * v.x;
      };
      Geometry.Dot = function(u, v) {
        return u.x * v.x + u.y * v.y;
      };
      Geometry.IsOnSegment = function(o, p, q) {
        return this.ApproxIsInRangePoint(o, p, q) && this.Orientation(o, p, q) == EOrientation.COLLINEAR;
      };
      Geometry.Orientation = function(o, p, q) {
        var c = (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x);
        if (Math.abs(c) <= Geometry._epsilon) return EOrientation.COLLINEAR;
        return c > 0 ? EOrientation.LEFT_TURN : EOrientation.RIGHT_TURN;
      };
      Geometry.IsSegmentIntersect = function(p1, q1, p2, q2) {
        var eps = this._epsilon;
        var max = Math.max;
        var min = Math.min;
        if (max(p1.x, q1.x) + eps < min(p2.x, q2.x) || max(p2.x, q2.x) + eps < min(p1.x, q1.x) || max(p1.y, q1.y) + eps < min(p2.y, q2.y) || max(p2.y, q2.y) + eps < min(p1.y, q1.y)) return false;
        return this.Orientation(p1, q1, p2) * this.Orientation(p1, q1, q2) <= 0 && this.Orientation(p2, q2, p1) * this.Orientation(p2, q2, q1) <= 0;
      };
      Geometry.IsLeftwardRayIntersect = function(o, p1, q1) {
        var eps = this._epsilon;
        var b = p1, t = q1;
        if (b.y > t.y) {
          b = q1;
          t = p1;
        }
        var oy = o.y;
        return b.y + eps < oy && oy - t.y <= eps && this.Orientation(b, t, o) == EOrientation.RIGHT_TURN;
      };
      Geometry.IsPointInPolygon = function(o, polygon) {
        var n = polygon.length;
        var i = 0, k = n - 1;
        var acc = 0;
        for (;i < n; k = i++) {
          var pi = polygon[i];
          var pk = polygon[k];
          if (this.IsOnSegment(o, pi, pk)) return true;
          this.IsLeftwardRayIntersect(o, pi, pk) && ++acc;
        }
        return acc % 2 === 1;
      };
      Geometry.RaySegmentIntersection = function(p, r, q, qs) {
        var tmp1 = this._tmpV2_1;
        var tmp2 = this._tmpV2_2;
        var eps = this._epsilon;
        var s = qs.sub(q, tmp1);
        var rxs = this.Cross(r, s);
        if (Math.abs(rxs) <= eps) {
          var cross2 = this.Cross(q.sub(p, tmp2), r);
          if (Math.abs(cross2) <= eps) {
            var pqDir = this.Dot(q.sub(p, tmp2), r);
            Math.abs(pqDir) <= eps && (pqDir = 0);
            var pqsDir = this.Dot(qs.sub(p, tmp2), r);
            Math.abs(pqsDir) <= eps && (pqsDir = 0);
            if (pqDir < 0 && pqsDir < 0) return null;
            if (pqDir * pqsDir <= 0) return p;
            if (pqDir > pqsDir) return qs;
            return q;
          }
          return null;
        }
        var pq = q.sub(p, tmp2);
        var u = this.Cross(pq, r) / rxs;
        if (u + eps < 0 || 1 + eps < u) return null;
        var t = this.Cross(pq, s) / rxs;
        if (t + eps < 0) return null;
        var result = r.mul(t, tmp2);
        result.addSelf(p);
        return result;
      };
      Geometry.PolygonToSegments = function(polygon, out) {
        out = out || [];
        var n = polygon.length;
        var i = 0, k = n - 1;
        for (;i < n; k = i++) out.push(new Segment(polygon[k], polygon[i]));
        return out;
      };
      Geometry.VisibilityPolygon = function(o, polygon) {
        return this.VisibilityPolygonWithSegments(o, this.PolygonToSegments(polygon));
      };
      Geometry.VisibilityPolygonWithSegments = function(o, segments) {
        var segmentCmp = new SegmentComparator(o, segments);
        var heap = new Heap_1.default(segmentCmp.Cmp.bind(segmentCmp));
        var eps = this._epsilon;
        var Orientation = this.Orientation;
        var events = [];
        for (var sid = 0, n_1 = segments.length; sid < n_1; ++sid) {
          var s = segments[sid];
          var oab = Orientation(o, s.a, s.b);
          if (oab === EOrientation.COLLINEAR) continue;
          if (oab === EOrientation.RIGHT_TURN) {
            events.push(new VisibilityEvent(EVisibilityEvent.START, s.a, sid));
            events.push(new VisibilityEvent(EVisibilityEvent.END, s.b, sid));
          } else {
            events.push(new VisibilityEvent(EVisibilityEvent.START, s.b, sid));
            events.push(new VisibilityEvent(EVisibilityEvent.END, s.a, sid));
          }
          var a = s.a, b = s.b;
          if (a.x > b.x) {
            a = b;
            b = s.a;
          }
          var abo = Orientation(a, b, o);
          abo === EOrientation.RIGHT_TURN && a.x + eps < o.x && o.x <= b.x + eps && heap.push(sid);
        }
        var angleCmp = new AngleComparator(o);
        events.sort(function(ve1, ve2) {
          var p1 = ve1.point;
          var p2 = ve2.point;
          if (Math.abs(p1.x - p2.x) <= eps && Math.abs(p1.y - p2.y) <= eps) {
            if (ve1.event === ve2.event) return 0;
            if (ve1.event === EVisibilityEvent.END && ve2.event === EVisibilityEvent.START) return -1;
            return 1;
          }
          return angleCmp.Cmp(p1, p2);
        });
        var result = [];
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
          var ve = events_1[_i];
          var point = ve.point;
          var eventType = ve.event;
          eventType === EVisibilityEvent.END && heap.remove(ve.sid);
          if (heap.isEmpty()) result.push(point); else if (-1 == segmentCmp.Cmp(ve.sid, heap.peek())) {
            var rayDir = point.sub(o);
            var nearestSid = heap.peek();
            var nearestSegment = segments[nearestSid];
            var intersection = this.RaySegmentIntersection(o, rayDir, nearestSegment.a, nearestSegment.b);
            intersection || console.error("should have an intersection");
            if (eventType === EVisibilityEvent.START) {
              result.push(intersection.clone());
              result.push(point);
            } else {
              result.push(point);
              result.push(intersection.clone());
            }
          }
          eventType == EVisibilityEvent.START && heap.push(ve.sid);
        }
        var n = result.length;
        var top = 0, prev = n - 1;
        var next;
        for (var i = 0; i < n; ++i) {
          next = i + 1;
          next >= n && (next -= n);
          if (Orientation(result[prev], result[i], result[next]) != EOrientation.COLLINEAR) {
            result[top] = result[i];
            prev = top++;
          }
        }
        result.length = top;
        return result;
      };
      Geometry._epsilon = 1e-5;
      Geometry._tmpV2_1 = cc.v2(0, 0);
      Geometry._tmpV2_2 = cc.v2(0, 0);
      return Geometry;
    }();
    exports.default = Geometry;
    cc._RF.pop();
  }, {
    "./Heap": "Heap"
  } ],
  Heap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10c1aAIRu1P0KYXDW465Uym", "Heap");
    "use strict";
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    var __spreadArrays = this && this.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
      k++) r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Heap = exports.toInt = void 0;
    exports.toInt = function(n) {
      return ~~n;
    };
    var Heap = function() {
      function Heap(compare) {
        var _this = this;
        void 0 === compare && (compare = Heap.minComparator);
        this.compare = compare;
        this.heapArray = [];
        this._limit = 0;
        this.offer = this.add;
        this.element = this.peek;
        this.poll = this.pop;
        this._invertedCompare = function(a, b) {
          return -1 * _this.compare(a, b);
        };
      }
      Heap.getChildrenIndexOf = function(idx) {
        return [ 2 * idx + 1, 2 * idx + 2 ];
      };
      Heap.getParentIndexOf = function(idx) {
        if (idx <= 0) return -1;
        var whichChildren = idx % 2 ? 1 : 2;
        return Math.floor((idx - whichChildren) / 2);
      };
      Heap.getSiblingIndexOf = function(idx) {
        if (idx <= 0) return -1;
        var whichChildren = idx % 2 ? 1 : -1;
        return idx + whichChildren;
      };
      Heap.minComparator = function(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      };
      Heap.maxComparator = function(a, b) {
        return b > a ? 1 : b < a ? -1 : 0;
      };
      Heap.minComparatorNumber = function(a, b) {
        return a - b;
      };
      Heap.maxComparatorNumber = function(a, b) {
        return b - a;
      };
      Heap.defaultIsEqual = function(a, b) {
        return a === b;
      };
      Heap.print = function(heap) {
        function deep(i) {
          var pi = Heap.getParentIndexOf(i);
          return Math.floor(Math.log2(pi + 1));
        }
        function repeat(str, times) {
          var out = "";
          for (;times > 0; --times) out += str;
          return out;
        }
        var node = 0;
        var lines = [];
        var maxLines = deep(heap.length - 1) + 2;
        var maxLength = 0;
        while (node < heap.length) {
          var i = deep(node) + 1;
          0 === node && (i = 0);
          var nodeText = String(heap.get(node));
          nodeText.length > maxLength && (maxLength = nodeText.length);
          lines[i] = lines[i] || [];
          lines[i].push(nodeText);
          node += 1;
        }
        return lines.map(function(line, i) {
          var times = Math.pow(2, maxLines - i) - 1;
          return repeat(" ", Math.floor(times / 2) * maxLength) + line.map(function(el) {
            var half = (maxLength - el.length) / 2;
            return repeat(" ", Math.ceil(half)) + el + repeat(" ", Math.floor(half));
          }).join(repeat(" ", times * maxLength));
        }).join("\n");
      };
      Heap.heapify = function(arr, compare) {
        var heap = new Heap(compare);
        heap.heapArray = arr;
        heap.init();
        return heap;
      };
      Heap.heappop = function(heapArr, compare) {
        var heap = new Heap(compare);
        heap.heapArray = heapArr;
        return heap.pop();
      };
      Heap.heappush = function(heapArr, item, compare) {
        var heap = new Heap(compare);
        heap.heapArray = heapArr;
        heap.push(item);
      };
      Heap.heappushpop = function(heapArr, item, compare) {
        var heap = new Heap(compare);
        heap.heapArray = heapArr;
        return heap.pushpop(item);
      };
      Heap.heapreplace = function(heapArr, item, compare) {
        var heap = new Heap(compare);
        heap.heapArray = heapArr;
        return heap.replace(item);
      };
      Heap.heaptop = function(heapArr, n, compare) {
        void 0 === n && (n = 1);
        var heap = new Heap(compare);
        heap.heapArray = heapArr;
        return heap.top(n);
      };
      Heap.heapbottom = function(heapArr, n, compare) {
        void 0 === n && (n = 1);
        var heap = new Heap(compare);
        heap.heapArray = heapArr;
        return heap.bottom(n);
      };
      Heap.prototype.add = function(element) {
        this._sortNodeUp(this.heapArray.push(element) - 1);
        this._applyLimit();
        return true;
      };
      Heap.prototype.addAll = function(elements) {
        var _a;
        var i = this.length;
        (_a = this.heapArray).push.apply(_a, elements);
        for (var l = this.length; i < l; ++i) this._sortNodeUp(i);
        this._applyLimit();
        return true;
      };
      Heap.prototype.bottom = function(n) {
        void 0 === n && (n = 1);
        if (0 === this.heapArray.length || n <= 0) return [];
        if (1 === this.heapArray.length) return [ this.heapArray[0] ];
        if (n >= this.heapArray.length) return __spreadArrays(this.heapArray);
        var result = this._bottomN_push(~~n);
        return result;
      };
      Heap.prototype.check = function() {
        var _this = this;
        return this.heapArray.find(function(el, j) {
          return !!_this.getChildrenOf(j).find(function(ch) {
            return _this.compare(el, ch) > 0;
          });
        });
      };
      Heap.prototype.clear = function() {
        this.heapArray = [];
      };
      Heap.prototype.clone = function() {
        var cloned = new Heap(this.comparator());
        cloned.heapArray = this.toArray();
        cloned._limit = this._limit;
        return cloned;
      };
      Heap.prototype.comparator = function() {
        return this.compare;
      };
      Heap.prototype.contains = function(o, fn) {
        void 0 === fn && (fn = Heap.defaultIsEqual);
        return this.heapArray.findIndex(function(el) {
          return fn(el, o);
        }) >= 0;
      };
      Heap.prototype.init = function(array) {
        array && (this.heapArray = __spreadArrays(array));
        for (var i = Math.floor(this.heapArray.length); i >= 0; --i) this._sortNodeDown(i);
        this._applyLimit();
      };
      Heap.prototype.isEmpty = function() {
        return 0 === this.length;
      };
      Heap.prototype.leafs = function() {
        if (0 === this.heapArray.length) return [];
        var pi = Heap.getParentIndexOf(this.heapArray.length - 1);
        return this.heapArray.slice(pi + 1);
      };
      Object.defineProperty(Heap.prototype, "length", {
        get: function() {
          return this.heapArray.length;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Heap.prototype, "limit", {
        get: function() {
          return this._limit;
        },
        set: function(_l) {
          this._limit = ~~_l;
          this._applyLimit();
        },
        enumerable: false,
        configurable: true
      });
      Heap.prototype.peek = function() {
        return this.heapArray[0];
      };
      Heap.prototype.pop = function() {
        var last = this.heapArray.pop();
        if (this.length > 0 && void 0 !== last) return this.replace(last);
        return last;
      };
      Heap.prototype.push = function() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) elements[_i] = arguments[_i];
        return !(elements.length < 1) && (1 === elements.length ? this.add(elements[0]) : this.addAll(elements));
      };
      Heap.prototype.pushpop = function(element) {
        var _a;
        if (this.compare(this.heapArray[0], element) < 0) {
          _a = [ this.heapArray[0], element ], element = _a[0], this.heapArray[0] = _a[1];
          this._sortNodeDown(0);
        }
        return element;
      };
      Heap.prototype.remove = function(o, fn) {
        void 0 === fn && (fn = Heap.defaultIsEqual);
        if (this.length > 0) {
          if (void 0 === o) {
            this.pop();
            return true;
          }
          var idx = this.heapArray.findIndex(function(el) {
            return fn(el, o);
          });
          if (idx >= 0) {
            if (0 === idx) this.pop(); else if (idx === this.length - 1) this.heapArray.pop(); else {
              this.heapArray.splice(idx, 1, this.heapArray.pop());
              this._sortNodeUp(idx);
              this._sortNodeDown(idx);
            }
            return true;
          }
        }
        return false;
      };
      Heap.prototype.replace = function(element) {
        var peek = this.heapArray[0];
        this.heapArray[0] = element;
        this._sortNodeDown(0);
        return peek;
      };
      Heap.prototype.size = function() {
        return this.length;
      };
      Heap.prototype.top = function(n) {
        void 0 === n && (n = 1);
        if (0 === this.heapArray.length || n <= 0) return [];
        if (1 === this.heapArray.length || 1 === n) return [ this.heapArray[0] ];
        if (n >= this.heapArray.length) return __spreadArrays(this.heapArray);
        var result = this._topN_push(~~n);
        return result;
      };
      Heap.prototype.toArray = function() {
        return __spreadArrays(this.heapArray);
      };
      Heap.prototype.toString = function() {
        return this.heapArray.toString();
      };
      Heap.prototype.get = function(i) {
        return this.heapArray[i];
      };
      Heap.prototype.getChildrenOf = function(idx) {
        var _this = this;
        return Heap.getChildrenIndexOf(idx).map(function(i) {
          return _this.heapArray[i];
        }).filter(function(e) {
          return void 0 !== e;
        });
      };
      Heap.prototype.getParentOf = function(idx) {
        var pi = Heap.getParentIndexOf(idx);
        return this.heapArray[pi];
      };
      Heap.prototype[Symbol.iterator] = function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            if (!this.length) return [ 3, 2 ];
            return [ 4, this.pop() ];

           case 1:
            _a.sent();
            return [ 3, 0 ];

           case 2:
            return [ 2 ];
          }
        });
      };
      Heap.prototype.iterator = function() {
        return this;
      };
      Heap.prototype._applyLimit = function() {
        if (this._limit && this._limit < this.heapArray.length) {
          var rm = this.heapArray.length - this._limit;
          while (rm) {
            this.heapArray.pop();
            --rm;
          }
        }
      };
      Heap.prototype._bottomN_push = function(n) {
        var bottomHeap = new Heap(this.compare);
        bottomHeap.limit = n;
        bottomHeap.heapArray = this.heapArray.slice(-n);
        bottomHeap.init();
        var startAt = this.heapArray.length - 1 - n;
        var parentStartAt = Heap.getParentIndexOf(startAt);
        var indices = [];
        for (var i = startAt; i > parentStartAt; --i) indices.push(i);
        var arr = this.heapArray;
        while (indices.length) {
          var i = indices.shift();
          if (this.compare(arr[i], bottomHeap.peek()) > 0) {
            bottomHeap.replace(arr[i]);
            i % 2 && indices.push(Heap.getParentIndexOf(i));
          }
        }
        return bottomHeap.toArray();
      };
      Heap.prototype._moveNode = function(j, k) {
        var _a;
        _a = [ this.heapArray[k], this.heapArray[j] ], this.heapArray[j] = _a[0], this.heapArray[k] = _a[1];
      };
      Heap.prototype._sortNodeDown = function(i) {
        var _this = this;
        var moveIt = i < this.heapArray.length - 1;
        var self = this.heapArray[i];
        var getPotentialParent = function(best, j) {
          _this.heapArray.length > j && _this.compare(_this.heapArray[j], _this.heapArray[best]) < 0 && (best = j);
          return best;
        };
        while (moveIt) {
          var childrenIdx = Heap.getChildrenIndexOf(i);
          var bestChildIndex = childrenIdx.reduce(getPotentialParent, childrenIdx[0]);
          var bestChild = this.heapArray[bestChildIndex];
          if ("undefined" !== typeof bestChild && this.compare(self, bestChild) > 0) {
            this._moveNode(i, bestChildIndex);
            i = bestChildIndex;
          } else moveIt = false;
        }
      };
      Heap.prototype._sortNodeUp = function(i) {
        var moveIt = i > 0;
        while (moveIt) {
          var pi = Heap.getParentIndexOf(i);
          if (pi >= 0 && this.compare(this.heapArray[pi], this.heapArray[i]) > 0) {
            this._moveNode(i, pi);
            i = pi;
          } else moveIt = false;
        }
      };
      Heap.prototype._topN_push = function(n) {
        var topHeap = new Heap(this._invertedCompare);
        topHeap.limit = n;
        var indices = [ 0 ];
        var arr = this.heapArray;
        while (indices.length) {
          var i = indices.shift();
          if (i < arr.length) if (topHeap.length < n) {
            topHeap.push(arr[i]);
            indices.push.apply(indices, Heap.getChildrenIndexOf(i));
          } else if (this.compare(arr[i], topHeap.peek()) < 0) {
            topHeap.replace(arr[i]);
            indices.push.apply(indices, Heap.getChildrenIndexOf(i));
          }
        }
        return topHeap.toArray();
      };
      Heap.prototype._topN_fill = function(n) {
        var heapArray = this.heapArray;
        var topHeap = new Heap(this._invertedCompare);
        topHeap.limit = n;
        topHeap.heapArray = heapArray.slice(0, n);
        topHeap.init();
        var branch = Heap.getParentIndexOf(n - 1) + 1;
        var indices = [];
        for (var i = branch; i < n; ++i) indices.push.apply(indices, Heap.getChildrenIndexOf(i).filter(function(l) {
          return l < heapArray.length;
        }));
        (n - 1) % 2 && indices.push(n);
        while (indices.length) {
          var i = indices.shift();
          if (i < heapArray.length && this.compare(heapArray[i], topHeap.peek()) < 0) {
            topHeap.replace(heapArray[i]);
            indices.push.apply(indices, Heap.getChildrenIndexOf(i));
          }
        }
        return topHeap.toArray();
      };
      Heap.prototype._topN_heap = function(n) {
        var topHeap = this.clone();
        var result = [];
        for (var i = 0; i < n; ++i) result.push(topHeap.pop());
        return result;
      };
      Heap.prototype._topIdxOf = function(list) {
        if (!list.length) return -1;
        var idx = 0;
        var top = list[idx];
        for (var i = 1; i < list.length; ++i) {
          var comp = this.compare(list[i], top);
          if (comp < 0) {
            idx = i;
            top = list[i];
          }
        }
        return idx;
      };
      Heap.prototype._topOf = function() {
        var list = [];
        for (var _i = 0; _i < arguments.length; _i++) list[_i] = arguments[_i];
        var heap = new Heap(this.compare);
        heap.init(list);
        return heap.peek();
      };
      return Heap;
    }();
    exports.Heap = Heap;
    exports.default = Heap;
    cc._RF.pop();
  }, {} ],
  MeshPolygonSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83cca83i39GZYau4f4uSxPl", "MeshPolygonSprite");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var gfx = cc.gfx;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, requireComponent = _a.requireComponent, menu = _a.menu;
    var MeshPolygonSprite = function(_super) {
      __extends(MeshPolygonSprite, _super);
      function MeshPolygonSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._offset = cc.v2(0, 0);
        _this._spriteFrame = null;
        _this._vertexes = [ cc.v2(0, 0), cc.v2(0, 100), cc.v2(100, 100), cc.v2(100, 0) ];
        _this.renderer = null;
        _this.mesh = null;
        _this._meshCache = {};
        return _this;
      }
      Object.defineProperty(MeshPolygonSprite.prototype, "offset", {
        get: function() {
          return this._offset;
        },
        set: function(value) {
          this._offset = value;
          this._updateMesh();
          this._applyVertexes();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MeshPolygonSprite.prototype, "spriteFrame", {
        get: function() {
          return this._spriteFrame;
        },
        set: function(value) {
          this._spriteFrame = value;
          this._refreshAll();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MeshPolygonSprite.prototype, "vertexes", {
        get: function() {
          return this._vertexes;
        },
        set: function(value) {
          this._vertexes = value;
          this._updateMesh();
          this._applyVertexes();
        },
        enumerable: false,
        configurable: true
      });
      MeshPolygonSprite.prototype.onLoad = function() {
        this._meshCache = {};
        var renderer = this.node.getComponent(cc.MeshRenderer) || this.node.addComponent(cc.MeshRenderer);
        renderer.mesh = null;
        this.renderer = renderer;
        var builtinMaterial = cc.Material.getBuiltinMaterial("unlit");
        renderer.setMaterial(0, builtinMaterial);
      };
      MeshPolygonSprite.prototype.onEnable = function() {
        this._refreshAll();
      };
      MeshPolygonSprite.prototype._refreshAll = function() {
        this._updateMesh();
        this._applySpriteFrame();
        this._applyVertexes();
      };
      MeshPolygonSprite.prototype._updateMesh = function() {
        var mesh = this._meshCache[this.vertexes.length];
        if (!mesh) {
          mesh = new cc.Mesh();
          mesh.init(new gfx.VertexFormat([ {
            name: gfx.ATTR_POSITION,
            type: gfx.ATTR_TYPE_FLOAT32,
            num: 2
          }, {
            name: gfx.ATTR_UV0,
            type: gfx.ATTR_TYPE_FLOAT32,
            num: 2
          } ]), this.vertexes.length, true);
          this._meshCache[this.vertexes.length] = mesh;
        }
        this.mesh = mesh;
      };
      MeshPolygonSprite.prototype._lerp = function(a, b, w) {
        return a + w * (b - a);
      };
      MeshPolygonSprite.prototype._applyVertexes = function() {
        var mesh = this.mesh;
        mesh.setVertices(gfx.ATTR_POSITION, this.vertexes);
        this._calculateUV();
        if (this.vertexes.length >= 3) {
          var ids_1 = [];
          var countor_1 = this.vertexes.map(function(p) {
            return {
              x: p.x,
              y: p.y
            };
          });
          var swctx = new poly2tri.SweepContext(countor_1, {
            cloneArrays: true
          });
          try {
            swctx.triangulate();
            var triangles = swctx.getTriangles();
            triangles.forEach(function(tri) {
              tri.getPoints().forEach(function(p) {
                var i = countor_1.indexOf(p);
                ids_1.push(i);
              });
            });
          } catch (e) {
            cc.error("poly2tri error", e);
          }
          if (0 === ids_1.length) {
            cc.log("\u8ba1\u7b97\u9876\u70b9\u7d22\u5f15 \u5931\u8d25");
            ids_1.push.apply(ids_1, this.vertexes.map(function(v, i) {
              return i;
            }));
          }
          mesh.setIndices(ids_1);
          this.renderer.mesh = mesh;
        }
      };
      MeshPolygonSprite.prototype._calculateUV = function() {
        var mesh = this.mesh;
        if (this.spriteFrame) {
          var uv = this.spriteFrame.uv;
          var texture = this.spriteFrame.getTexture();
          var uv_l = uv[0];
          var uv_r = uv[6];
          var uv_b = uv[3];
          var uv_t = uv[5];
          var uvs = [];
          for (var _i = 0, _a = this.vertexes; _i < _a.length; _i++) {
            var pt = _a[_i];
            var u = this._lerp(uv_l, uv_r, (pt.x + texture.width / 2 + this.offset.x) / texture.width);
            var v = this._lerp(uv_b, uv_t, (pt.y + texture.height / 2 - this.offset.y) / texture.height);
            uvs.push(cc.v2(u, v));
          }
          mesh.setVertices(gfx.ATTR_UV0, uvs);
        }
      };
      MeshPolygonSprite.prototype._applySpriteFrame = function() {
        if (this.spriteFrame) {
          var renderer = this.renderer;
          var material = renderer.getMaterial(0);
          var texture = this.spriteFrame.getTexture();
          material.define("USE_DIFFUSE_TEXTURE", true);
          material.setProperty("diffuseTexture", texture);
        }
      };
      __decorate([ property ], MeshPolygonSprite.prototype, "_offset", void 0);
      __decorate([ property({
        type: cc.Vec2,
        tooltip: "\u4f4d\u7f6e\u504f\u79fb\u91cf"
      }) ], MeshPolygonSprite.prototype, "offset", null);
      __decorate([ property ], MeshPolygonSprite.prototype, "_spriteFrame", void 0);
      __decorate([ property({
        type: cc.SpriteFrame,
        tooltip: "\u7cbe\u7075\u7684\u7cbe\u7075\u5e27"
      }) ], MeshPolygonSprite.prototype, "spriteFrame", null);
      __decorate([ property ], MeshPolygonSprite.prototype, "_vertexes", void 0);
      __decorate([ property({
        type: cc.Vec2,
        tooltip: "\u9876\u70b9\u5750\u6807"
      }) ], MeshPolygonSprite.prototype, "vertexes", null);
      MeshPolygonSprite = __decorate([ ccclass, executeInEditMode, requireComponent(cc.MeshRenderer), menu("lamyoung.com/MeshPolygonSprite") ], MeshPolygonSprite);
      return MeshPolygonSprite;
    }(cc.Component);
    exports.default = MeshPolygonSprite;
    cc._RF.pop();
  }, {} ],
  SceneMain: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d37beYAEhRPmJyD6vHYZOMb", "SceneMain");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var VisibilityRenderer_1 = require("../shader/Visibility/VisibilityRenderer");
    var Geometry_1 = require("./Geometry");
    var MeshPolygonSprite_1 = require("./MeshPolygonSprite");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SceneMain = function(_super) {
      __extends(SceneMain, _super);
      function SceneMain() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.graphics = null;
        _this.visibilityRenderer = null;
        _this.obstacles = [];
        _this.viewPoint = null;
        _this.boundary = null;
        _this.btnCircleFOV = null;
        _this.btnUnlimitFOV = null;
        _this.btnRadar = null;
        _this._epsilon = 1e-5;
        return _this;
      }
      SceneMain.prototype.onLoad = function() {
        var _a, _b, _c;
        var renderer = this.visibilityRenderer;
        null === (_a = this.btnCircleFOV) || void 0 === _a ? void 0 : _a.on("click", function() {
          null === renderer || void 0 === renderer ? void 0 : renderer.SetCircleFOV(true);
        });
        null === (_b = this.btnUnlimitFOV) || void 0 === _b ? void 0 : _b.on("click", function() {
          null === renderer || void 0 === renderer ? void 0 : renderer.SetCircleFOV(false);
        });
        var enableRadar = false;
        null === (_c = this.btnRadar) || void 0 === _c ? void 0 : _c.on("click", function() {
          enableRadar = !enableRadar;
          null === renderer || void 0 === renderer ? void 0 : renderer.SetRadarRing(enableRadar);
        });
      };
      SceneMain.prototype.DrawPolygon = function(polygon) {
        if (0 === polygon.length) return;
        var graphics = this.graphics;
        var p0 = polygon[0];
        graphics.moveTo(p0.x, p0.y);
        for (var i = 1, n = polygon.length; i < n; ++i) {
          var pi = polygon[i];
          graphics.lineTo(pi.x, pi.y);
        }
        graphics.close();
      };
      SceneMain.prototype.update = function() {
        var boundary = this.boundary;
        var l = boundary.x - boundary.anchorX * boundary.width, r = boundary.x + boundary.anchorX * boundary.width, t = boundary.y + boundary.anchorY * boundary.height, b = boundary.y - boundary.anchorY * boundary.height;
        var segments = [];
        for (var _i = 0, _a = this.obstacles; _i < _a.length; _i++) {
          var ob = _a[_i];
          var polygon = ob.vertexes;
          Geometry_1.default.PolygonToSegments(polygon, segments);
        }
        var shouldExtendBoundary = true;
        if (shouldExtendBoundary) {
          for (var _b = 0, _c = this.obstacles; _b < _c.length; _b++) {
            var ob = _c[_b];
            var polygon = ob.vertexes;
            for (var _d = 0, polygon_1 = polygon; _d < polygon_1.length; _d++) {
              var p = polygon_1[_d];
              p.x < l ? l = p.x : p.x > r && (r = p.x);
              p.y < b ? b = p.y : p.y > t && (t = p.y);
            }
          }
          l -= 1;
          r += 1;
          b -= 1;
          t += 1;
        }
        var boundaryVertex = [];
        boundaryVertex.push(cc.v2(l, b));
        boundaryVertex.push(cc.v2(r, b));
        boundaryVertex.push(cc.v2(r, t));
        boundaryVertex.push(cc.v2(l, t));
        Geometry_1.default.PolygonToSegments(boundaryVertex, segments);
        var o = this.viewPoint.position;
        var visibility = Geometry_1.default.VisibilityPolygonWithSegments(o, segments);
        var renderer = this.visibilityRenderer;
        renderer.SetPolygon(o, visibility);
      };
      __decorate([ property(cc.Graphics) ], SceneMain.prototype, "graphics", void 0);
      __decorate([ property(VisibilityRenderer_1.default) ], SceneMain.prototype, "visibilityRenderer", void 0);
      __decorate([ property([ MeshPolygonSprite_1.default ]) ], SceneMain.prototype, "obstacles", void 0);
      __decorate([ property(cc.Node) ], SceneMain.prototype, "viewPoint", void 0);
      __decorate([ property(cc.Node) ], SceneMain.prototype, "boundary", void 0);
      __decorate([ property(cc.Node) ], SceneMain.prototype, "btnCircleFOV", void 0);
      __decorate([ property(cc.Node) ], SceneMain.prototype, "btnUnlimitFOV", void 0);
      __decorate([ property(cc.Node) ], SceneMain.prototype, "btnRadar", void 0);
      SceneMain = __decorate([ ccclass ], SceneMain);
      return SceneMain;
    }(cc.Component);
    exports.default = SceneMain;
    cc._RF.pop();
  }, {
    "../shader/Visibility/VisibilityRenderer": "VisibilityRenderer",
    "./Geometry": "Geometry",
    "./MeshPolygonSprite": "MeshPolygonSprite"
  } ],
  SimpleDraggable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4563cXmT7tHk5NjyrVseRb4", "SimpleDraggable");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SimpleDraggable = function(_super) {
      __extends(SimpleDraggable, _super);
      function SimpleDraggable() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._touchOffset = cc.Vec2.ZERO;
        _this._isDragging = false;
        _this._moveCallback = null;
        return _this;
      }
      SimpleDraggable.prototype.onLoad = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchEnd.bind(this));
      };
      SimpleDraggable.prototype.Setup = function(moveCallback) {
        this._moveCallback = moveCallback;
      };
      SimpleDraggable.prototype.OnTouchStart = function(e) {
        var touchWorldPos = e.getLocation();
        var nodeWorldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this._touchOffset = nodeWorldPos.sub(touchWorldPos);
        this._isDragging = true;
        this._moveCallback && this._moveCallback(this.node.position);
      };
      SimpleDraggable.prototype.OnTouchMove = function(e) {
        if (!this._isDragging) return;
        var touchWorldPos = e.getLocation();
        this.TraceTouchPos(touchWorldPos);
        this._moveCallback && this._moveCallback(this.node.position);
      };
      SimpleDraggable.prototype.OnTouchEnd = function(e) {
        if (!this._isDragging) return;
        this._isDragging = false;
      };
      SimpleDraggable.prototype.TraceTouchPos = function(worldPos) {
        var nodeWorldPos = worldPos.add(this._touchOffset);
        var localPos = this.node.parent.convertToNodeSpaceAR(nodeWorldPos);
        this.node.position = localPos;
      };
      SimpleDraggable = __decorate([ ccclass ], SimpleDraggable);
      return SimpleDraggable;
    }(cc.Component);
    exports.default = SimpleDraggable;
    cc._RF.pop();
  }, {} ],
  VisibilityAssembler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ad1cdP1ILpK5bXtnRD6I5Jl", "VisibilityAssembler");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var gfx = cc.gfx;
    var vfmtPosWeb = new gfx.VertexFormat([ {
      name: gfx.ATTR_POSITION,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    } ]);
    var VisibilityAssembler = function(_super) {
      __extends(VisibilityAssembler, _super);
      function VisibilityAssembler() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.floatsPerVert = 2;
        _this.origin = null;
        _this.polygon = null;
        _this._renderData = null;
        return _this;
      }
      VisibilityAssembler.prototype.init = function(comp) {
        _super.prototype.init.call(this, comp);
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
      };
      VisibilityAssembler.prototype.updateColor = function(comp, color) {};
      VisibilityAssembler.prototype.updateUVs = function(comp) {};
      VisibilityAssembler.prototype.updateVerts = function(comp) {};
      VisibilityAssembler.prototype.getVfmt = function() {
        return vfmtPosWeb;
      };
      VisibilityAssembler.prototype.getBuffer = function() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
      };
      VisibilityAssembler.prototype.fillBuffers = function(comp, renderer) {
        var origin = this.origin;
        var polygon = this.polygon;
        if (!origin || !polygon || polygon.length <= 2) return;
        var pointsCount = polygon.length;
        var verticesCount = 1 + pointsCount;
        var indicesCount = 3 * pointsCount;
        var node = comp.node;
        var offsetX = node.width * node.anchorX;
        var offsetY = node.height * node.anchorY;
        var buffer = this.getBuffer();
        var offsetInfo = buffer.request(verticesCount, indicesCount);
        var vertexOffset = offsetInfo.byteOffset >> 2, vbuf = buffer._vData;
        vbuf[vertexOffset++] = origin.x + offsetX;
        vbuf[vertexOffset++] = origin.y + offsetY;
        for (var _i = 0, polygon_1 = polygon; _i < polygon_1.length; _i++) {
          var p = polygon_1[_i];
          vbuf[vertexOffset++] = p.x + offsetX;
          vbuf[vertexOffset++] = p.y + offsetY;
        }
        var ibuf = buffer._iData, indiceOffset = offsetInfo.indiceOffset, vertexId = offsetInfo.vertexOffset;
        var originVertexId = vertexId;
        ibuf[indiceOffset++] = originVertexId;
        ibuf[indiceOffset++] = originVertexId + pointsCount;
        ibuf[indiceOffset++] = originVertexId + 1;
        for (var i = 1; i < pointsCount; ++i) {
          ibuf[indiceOffset++] = originVertexId;
          ibuf[indiceOffset++] = originVertexId + i;
          ibuf[indiceOffset++] = originVertexId + i + 1;
        }
      };
      return VisibilityAssembler;
    }(cc.Assembler);
    exports.default = VisibilityAssembler;
    cc._RF.pop();
  }, {} ],
  VisibilityRenderer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8c3eeplItNz5v8UAdlzLyt", "VisibilityRenderer");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var VisibilityAssembler_1 = require("./VisibilityAssembler");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var VisibilityRenderer = function(_super) {
      __extends(VisibilityRenderer, _super);
      function VisibilityRenderer() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      VisibilityRenderer.prototype.onLoad = function() {};
      VisibilityRenderer.prototype.SetPolygon = function(origin, polygon) {
        var assembler = this._assembler;
        if (assembler) {
          assembler.origin = origin;
          assembler.polygon = polygon;
        }
        var material = this.getMaterial(0);
        if (material) {
          var node = this.node;
          var offsetX = node.width * node.anchorX;
          var offsetY = node.height * node.anchorY;
          material.setProperty("origin", [ origin.x + offsetX, origin.y + offsetY ]);
        }
        this.setVertsDirty();
      };
      VisibilityRenderer.prototype.SetCircleFOV = function(value, radius) {
        void 0 === radius && (radius = 100);
        var material = this.getMaterial(0);
        if (material) {
          material.define("GT_CIRCLE_FOV", value);
          material.setProperty("radius", radius);
        }
      };
      VisibilityRenderer.prototype.SetRadarRing = function(value, radius) {
        void 0 === radius && (radius = 360);
        var material = this.getMaterial(0);
        if (material) {
          material.define("GT_RADAR_RING", value);
          material.setProperty("radarRadius", radius);
        }
      };
      VisibilityRenderer.prototype._resetAssembler = function() {
        this.setVertsDirty();
        var assembler = this._assembler = new VisibilityAssembler_1.default();
        assembler.init(this);
      };
      VisibilityRenderer.prototype.update = function() {
        this.setVertsDirty();
      };
      VisibilityRenderer = __decorate([ ccclass ], VisibilityRenderer);
      return VisibilityRenderer;
    }(cc.Sprite);
    exports.default = VisibilityRenderer;
    cc._RF.pop();
  }, {
    "./VisibilityAssembler": "VisibilityAssembler"
  } ]
}, {}, [ "Geometry", "Heap", "MeshPolygonSprite", "SceneMain", "SimpleDraggable", "VisibilityAssembler", "VisibilityRenderer" ]);