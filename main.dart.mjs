let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    // Imports
    const dart2wasm = {

_1: (x0,x1,x2) => x0.set(x1,x2),
_2: (x0,x1,x2) => x0.set(x1,x2),
_6: f => finalizeWrapper(f,x0 => dartInstance.exports._6(f,x0)),
_7: x0 => new window.FinalizationRegistry(x0),
_8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
_9: (x0,x1) => x0.unregister(x1),
_10: (x0,x1,x2) => x0.slice(x1,x2),
_11: (x0,x1) => x0.decode(x1),
_12: (x0,x1) => x0.segment(x1),
_13: () => new TextDecoder(),
_14: x0 => x0.buffer,
_15: x0 => x0.wasmMemory,
_16: () => globalThis.window._flutter_skwasmInstance,
_17: x0 => x0.rasterStartMilliseconds,
_18: x0 => x0.rasterEndMilliseconds,
_19: x0 => x0.imageBitmaps,
_164: x0 => x0.focus(),
_165: x0 => x0.select(),
_166: (x0,x1) => x0.append(x1),
_167: x0 => x0.remove(),
_170: x0 => x0.unlock(),
_175: x0 => x0.getReader(),
_185: x0 => new MutationObserver(x0),
_204: (x0,x1,x2) => x0.addEventListener(x1,x2),
_205: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_208: x0 => new ResizeObserver(x0),
_211: (x0,x1) => new Intl.Segmenter(x0,x1),
_212: x0 => x0.next(),
_213: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
_290: x0 => x0.close(),
_291: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
_292: x0 => new window.ImageDecoder(x0),
_293: x0 => x0.close(),
_294: x0 => ({frameIndex: x0}),
_295: (x0,x1) => x0.decode(x1),
_298: f => finalizeWrapper(f,x0 => dartInstance.exports._298(f,x0)),
_299: f => finalizeWrapper(f,x0 => dartInstance.exports._299(f,x0)),
_300: (x0,x1) => ({addView: x0,removeView: x1}),
_301: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._301(f,arguments.length,x0) }),
_302: f => finalizeWrapper(f,() => dartInstance.exports._302(f)),
_303: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
_304: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._304(f,arguments.length,x0) }),
_305: x0 => ({runApp: x0}),
_306: x0 => new Uint8Array(x0),
_308: x0 => x0.preventDefault(),
_309: x0 => x0.stopPropagation(),
_310: (x0,x1) => x0.addListener(x1),
_311: (x0,x1) => x0.removeListener(x1),
_312: (x0,x1) => x0.prepend(x1),
_313: x0 => x0.remove(),
_314: x0 => x0.disconnect(),
_315: (x0,x1) => x0.addListener(x1),
_316: (x0,x1) => x0.removeListener(x1),
_319: (x0,x1) => x0.append(x1),
_320: x0 => x0.remove(),
_321: x0 => x0.stopPropagation(),
_325: x0 => x0.preventDefault(),
_326: (x0,x1) => x0.append(x1),
_327: x0 => x0.remove(),
_332: (x0,x1) => x0.appendChild(x1),
_333: (x0,x1,x2) => x0.insertBefore(x1,x2),
_334: (x0,x1) => x0.removeChild(x1),
_335: (x0,x1) => x0.appendChild(x1),
_336: (x0,x1) => x0.transferFromImageBitmap(x1),
_337: (x0,x1) => x0.append(x1),
_338: (x0,x1) => x0.append(x1),
_339: (x0,x1) => x0.append(x1),
_340: x0 => x0.remove(),
_341: x0 => x0.focus(),
_342: x0 => x0.focus(),
_343: x0 => x0.remove(),
_344: x0 => x0.focus(),
_345: x0 => x0.remove(),
_346: (x0,x1) => x0.appendChild(x1),
_347: (x0,x1) => x0.append(x1),
_348: x0 => x0.focus(),
_349: (x0,x1) => x0.append(x1),
_350: x0 => x0.remove(),
_351: (x0,x1) => x0.append(x1),
_352: (x0,x1) => x0.append(x1),
_353: (x0,x1,x2) => x0.insertBefore(x1,x2),
_354: (x0,x1) => x0.append(x1),
_355: (x0,x1,x2) => x0.insertBefore(x1,x2),
_356: x0 => x0.remove(),
_357: x0 => x0.remove(),
_358: x0 => x0.remove(),
_359: (x0,x1) => x0.append(x1),
_360: x0 => x0.remove(),
_361: x0 => x0.remove(),
_362: x0 => x0.getBoundingClientRect(),
_363: x0 => x0.remove(),
_364: x0 => x0.blur(),
_366: x0 => x0.focus(),
_367: x0 => x0.focus(),
_368: x0 => x0.remove(),
_369: x0 => x0.focus(),
_370: x0 => x0.focus(),
_371: x0 => x0.blur(),
_372: x0 => x0.remove(),
_385: (x0,x1) => x0.append(x1),
_386: x0 => x0.remove(),
_387: (x0,x1) => x0.append(x1),
_388: (x0,x1,x2) => x0.insertBefore(x1,x2),
_389: x0 => x0.focus(),
_390: x0 => x0.focus(),
_391: x0 => x0.focus(),
_392: x0 => x0.focus(),
_393: x0 => x0.focus(),
_394: x0 => x0.focus(),
_395: x0 => x0.blur(),
_396: x0 => x0.remove(),
_398: x0 => x0.preventDefault(),
_399: x0 => x0.focus(),
_400: x0 => x0.preventDefault(),
_401: x0 => x0.preventDefault(),
_402: x0 => x0.preventDefault(),
_403: x0 => x0.focus(),
_404: x0 => x0.focus(),
_405: x0 => x0.focus(),
_406: x0 => x0.focus(),
_407: x0 => x0.focus(),
_408: x0 => x0.focus(),
_409: (x0,x1) => x0.observe(x1),
_410: x0 => x0.disconnect(),
_411: (x0,x1) => x0.appendChild(x1),
_412: (x0,x1) => x0.appendChild(x1),
_413: (x0,x1) => x0.appendChild(x1),
_414: (x0,x1) => x0.append(x1),
_415: (x0,x1) => x0.append(x1),
_416: x0 => x0.remove(),
_417: (x0,x1) => x0.append(x1),
_419: (x0,x1) => x0.appendChild(x1),
_420: (x0,x1) => x0.append(x1),
_421: x0 => x0.remove(),
_422: (x0,x1) => x0.append(x1),
_426: (x0,x1) => x0.appendChild(x1),
_427: x0 => x0.remove(),
_978: () => globalThis.window.flutterConfiguration,
_979: x0 => x0.assetBase,
_983: x0 => x0.debugShowSemanticsNodes,
_984: x0 => x0.hostElement,
_985: x0 => x0.multiViewEnabled,
_986: x0 => x0.nonce,
_988: x0 => x0.fontFallbackBaseUrl,
_989: x0 => x0.useColorEmoji,
_993: x0 => x0.console,
_994: x0 => x0.devicePixelRatio,
_995: x0 => x0.document,
_996: x0 => x0.history,
_997: x0 => x0.innerHeight,
_998: x0 => x0.innerWidth,
_999: x0 => x0.location,
_1000: x0 => x0.navigator,
_1001: x0 => x0.visualViewport,
_1002: x0 => x0.performance,
_1003: (x0,x1) => x0.fetch(x1),
_1006: (x0,x1) => x0.dispatchEvent(x1),
_1007: (x0,x1) => x0.matchMedia(x1),
_1008: (x0,x1) => x0.getComputedStyle(x1),
_1010: x0 => x0.screen,
_1011: (x0,x1) => x0.requestAnimationFrame(x1),
_1012: f => finalizeWrapper(f,x0 => dartInstance.exports._1012(f,x0)),
_1016: (x0,x1) => x0.warn(x1),
_1020: () => globalThis.window,
_1021: () => globalThis.Intl,
_1022: () => globalThis.Symbol,
_1025: x0 => x0.clipboard,
_1026: x0 => x0.maxTouchPoints,
_1027: x0 => x0.vendor,
_1028: x0 => x0.language,
_1029: x0 => x0.platform,
_1030: x0 => x0.userAgent,
_1031: x0 => x0.languages,
_1032: x0 => x0.documentElement,
_1033: (x0,x1) => x0.querySelector(x1),
_1035: (x0,x1) => x0.createElement(x1),
_1037: (x0,x1) => x0.execCommand(x1),
_1040: (x0,x1) => x0.createTextNode(x1),
_1041: (x0,x1) => x0.createEvent(x1),
_1045: x0 => x0.head,
_1046: x0 => x0.body,
_1047: (x0,x1) => x0.title = x1,
_1050: x0 => x0.activeElement,
_1053: x0 => x0.visibilityState,
_1054: () => globalThis.document,
_1055: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1056: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1057: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1058: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_1061: f => finalizeWrapper(f,x0 => dartInstance.exports._1061(f,x0)),
_1062: x0 => x0.target,
_1064: x0 => x0.timeStamp,
_1065: x0 => x0.type,
_1066: x0 => x0.preventDefault(),
_1071: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
_1076: x0 => x0.firstChild,
_1081: x0 => x0.parentElement,
_1083: x0 => x0.parentNode,
_1086: (x0,x1) => x0.removeChild(x1),
_1087: (x0,x1) => x0.removeChild(x1),
_1088: x0 => x0.isConnected,
_1089: (x0,x1) => x0.textContent = x1,
_1092: (x0,x1) => x0.contains(x1),
_1097: x0 => x0.firstElementChild,
_1099: x0 => x0.nextElementSibling,
_1100: x0 => x0.clientHeight,
_1101: x0 => x0.clientWidth,
_1102: x0 => x0.id,
_1103: (x0,x1) => x0.id = x1,
_1106: (x0,x1) => x0.spellcheck = x1,
_1107: x0 => x0.tagName,
_1108: x0 => x0.style,
_1109: (x0,x1) => x0.append(x1),
_1110: (x0,x1) => x0.getAttribute(x1),
_1111: x0 => x0.getBoundingClientRect(),
_1115: (x0,x1) => x0.closest(x1),
_1118: (x0,x1) => x0.querySelectorAll(x1),
_1119: x0 => x0.remove(),
_1120: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1121: (x0,x1) => x0.removeAttribute(x1),
_1122: (x0,x1) => x0.tabIndex = x1,
_1125: x0 => x0.scrollTop,
_1126: (x0,x1) => x0.scrollTop = x1,
_1127: x0 => x0.scrollLeft,
_1128: (x0,x1) => x0.scrollLeft = x1,
_1129: x0 => x0.classList,
_1130: (x0,x1) => x0.className = x1,
_1136: (x0,x1) => x0.getElementsByClassName(x1),
_1137: x0 => x0.click(),
_1139: (x0,x1) => x0.hasAttribute(x1),
_1141: (x0,x1) => x0.attachShadow(x1),
_1144: (x0,x1) => x0.getPropertyValue(x1),
_1146: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
_1148: (x0,x1) => x0.removeProperty(x1),
_1150: x0 => x0.offsetLeft,
_1151: x0 => x0.offsetTop,
_1152: x0 => x0.offsetParent,
_1154: (x0,x1) => x0.name = x1,
_1155: x0 => x0.content,
_1156: (x0,x1) => x0.content = x1,
_1169: (x0,x1) => x0.nonce = x1,
_1174: x0 => x0.now(),
_1176: (x0,x1) => x0.width = x1,
_1178: (x0,x1) => x0.height = x1,
_1181: (x0,x1) => x0.getContext(x1),
_1256: x0 => x0.status,
_1257: x0 => x0.headers,
_1258: x0 => x0.body,
_1260: x0 => x0.arrayBuffer(),
_1264: (x0,x1) => x0.get(x1),
_1266: x0 => x0.read(),
_1267: x0 => x0.value,
_1268: x0 => x0.done,
_1270: x0 => x0.name,
_1271: x0 => x0.x,
_1272: x0 => x0.y,
_1275: x0 => x0.top,
_1276: x0 => x0.right,
_1277: x0 => x0.bottom,
_1278: x0 => x0.left,
_1289: x0 => x0.height,
_1290: x0 => x0.width,
_1291: (x0,x1) => x0.value = x1,
_1293: (x0,x1) => x0.placeholder = x1,
_1294: (x0,x1) => x0.name = x1,
_1295: x0 => x0.selectionDirection,
_1296: x0 => x0.selectionStart,
_1297: x0 => x0.selectionEnd,
_1300: x0 => x0.value,
_1301: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1306: x0 => x0.readText(),
_1308: (x0,x1) => x0.writeText(x1),
_1309: x0 => x0.altKey,
_1310: x0 => x0.code,
_1311: x0 => x0.ctrlKey,
_1312: x0 => x0.key,
_1313: x0 => x0.keyCode,
_1314: x0 => x0.location,
_1315: x0 => x0.metaKey,
_1316: x0 => x0.repeat,
_1317: x0 => x0.shiftKey,
_1318: x0 => x0.isComposing,
_1319: (x0,x1) => x0.getModifierState(x1),
_1320: x0 => x0.state,
_1323: (x0,x1) => x0.go(x1),
_1324: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
_1325: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
_1326: x0 => x0.pathname,
_1327: x0 => x0.search,
_1328: x0 => x0.hash,
_1331: x0 => x0.state,
_1335: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1335(f,x0,x1)),
_1337: (x0,x1,x2) => x0.observe(x1,x2),
_1340: x0 => x0.attributeName,
_1341: x0 => x0.type,
_1342: x0 => x0.matches,
_1345: x0 => x0.matches,
_1346: x0 => x0.relatedTarget,
_1347: x0 => x0.clientX,
_1348: x0 => x0.clientY,
_1349: x0 => x0.offsetX,
_1350: x0 => x0.offsetY,
_1353: x0 => x0.button,
_1354: x0 => x0.buttons,
_1355: x0 => x0.ctrlKey,
_1356: (x0,x1) => x0.getModifierState(x1),
_1357: x0 => x0.pointerId,
_1358: x0 => x0.pointerType,
_1359: x0 => x0.pressure,
_1360: x0 => x0.tiltX,
_1361: x0 => x0.tiltY,
_1362: x0 => x0.getCoalescedEvents(),
_1363: x0 => x0.deltaX,
_1364: x0 => x0.deltaY,
_1365: x0 => x0.wheelDeltaX,
_1366: x0 => x0.wheelDeltaY,
_1367: x0 => x0.deltaMode,
_1372: x0 => x0.changedTouches,
_1374: x0 => x0.clientX,
_1375: x0 => x0.clientY,
_1376: x0 => x0.data,
_1377: (x0,x1) => x0.type = x1,
_1378: (x0,x1) => x0.max = x1,
_1379: (x0,x1) => x0.min = x1,
_1380: (x0,x1) => x0.value = x1,
_1381: x0 => x0.value,
_1382: x0 => x0.disabled,
_1383: (x0,x1) => x0.disabled = x1,
_1384: (x0,x1) => x0.placeholder = x1,
_1385: (x0,x1) => x0.name = x1,
_1386: (x0,x1) => x0.autocomplete = x1,
_1387: x0 => x0.selectionDirection,
_1388: x0 => x0.selectionStart,
_1389: x0 => x0.selectionEnd,
_1393: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1400: (x0,x1) => x0.add(x1),
_1403: (x0,x1) => x0.noValidate = x1,
_1404: (x0,x1) => x0.method = x1,
_1405: (x0,x1) => x0.action = x1,
_1433: x0 => x0.orientation,
_1434: x0 => x0.width,
_1435: x0 => x0.height,
_1436: (x0,x1) => x0.lock(x1),
_1453: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1453(f,x0,x1)),
_1463: x0 => x0.length,
_1465: (x0,x1) => x0.item(x1),
_1466: x0 => x0.length,
_1467: (x0,x1) => x0.item(x1),
_1468: x0 => x0.iterator,
_1469: x0 => x0.Segmenter,
_1470: x0 => x0.v8BreakIterator,
_1473: x0 => x0.done,
_1474: x0 => x0.value,
_1475: x0 => x0.index,
_1479: (x0,x1) => x0.adoptText(x1),
_1480: x0 => x0.first(),
_1482: x0 => x0.next(),
_1483: x0 => x0.current(),
_1495: x0 => x0.hostElement,
_1496: x0 => x0.viewConstraints,
_1498: x0 => x0.maxHeight,
_1499: x0 => x0.maxWidth,
_1500: x0 => x0.minHeight,
_1501: x0 => x0.minWidth,
_1502: x0 => x0.loader,
_1503: () => globalThis._flutter,
_1504: (x0,x1) => x0.didCreateEngineInitializer(x1),
_1505: (x0,x1,x2) => x0.call(x1,x2),
_1506: () => globalThis.Promise,
_1507: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1507(f,x0,x1)),
_1512: x0 => x0.length,
_1515: x0 => x0.tracks,
_1519: x0 => x0.image,
_1524: x0 => x0.codedWidth,
_1525: x0 => x0.codedHeight,
_1528: x0 => x0.duration,
_1531: x0 => x0.ready,
_1532: x0 => x0.selectedTrack,
_1533: x0 => x0.repetitionCount,
_1534: x0 => x0.frameCount,
_1579: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
_1580: (x0,x1) => globalThis.initializeApp(x0,x1),
_1581: x0 => globalThis.getApp(x0),
_1582: () => globalThis.getApp(),
_1585: () => globalThis.firebase_core.SDK_VERSION,
_1592: x0 => x0.apiKey,
_1594: x0 => x0.authDomain,
_1596: x0 => x0.databaseURL,
_1598: x0 => x0.projectId,
_1600: x0 => x0.storageBucket,
_1602: x0 => x0.messagingSenderId,
_1604: x0 => x0.measurementId,
_1606: x0 => x0.appId,
_1608: x0 => x0.name,
_1609: x0 => x0.options,
_1610: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
_1648: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
_1649: () => globalThis.firebase_auth.debugErrorMap,
_1653: () => globalThis.firebase_auth.browserSessionPersistence,
_1655: () => globalThis.firebase_auth.browserLocalPersistence,
_1657: () => globalThis.firebase_auth.indexedDBLocalPersistence,
_1661: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
_1719: x0 => x0.uid,
_1730: x0 => x0.toJSON(),
_1815: () => globalThis.firebase_auth.browserPopupRedirectResolver,
_1841: (x0,x1) => x0.getItem(x1),
_1845: (x0,x1) => x0.createElement(x1),
_1852: f => finalizeWrapper(f,x0 => dartInstance.exports._1852(f,x0)),
_1853: f => finalizeWrapper(f,x0 => dartInstance.exports._1853(f,x0)),
_1854: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
_1861: x0 => globalThis.firebase_analytics.getAnalytics(x0),
_1864: (x0,x1,x2,x3) => globalThis.firebase_analytics.logEvent(x0,x1,x2,x3),
_1875: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9),
_1876: (x0,x1) => new firebase_firestore.GeoPoint(x0,x1),
_1878: x0 => globalThis.firebase_firestore.Bytes.fromUint8Array(x0),
_1881: x0 => globalThis.firebase_firestore.Timestamp.fromMillis(x0),
_1888: x0 => ({source: x0}),
_1890: x0 => ({serverTimestamps: x0}),
_1891: (x0,x1) => globalThis.firebase_firestore.getFirestore(x0,x1),
_1896: (x0,x1) => globalThis.firebase_firestore.collection(x0,x1),
_1902: (x0,x1) => globalThis.firebase_firestore.doc(x0,x1),
_1903: () => globalThis.firebase_firestore.documentId(),
_1907: x0 => globalThis.firebase_firestore.getDoc(x0),
_1908: x0 => globalThis.firebase_firestore.getDocFromCache(x0),
_1909: x0 => globalThis.firebase_firestore.getDocFromServer(x0),
_1950: x0 => x0.path,
_1953: () => globalThis.firebase_firestore.GeoPoint,
_1954: x0 => x0.latitude,
_1955: x0 => x0.longitude,
_1957: () => globalThis.firebase_firestore.Bytes,
_1959: x0 => x0.toUint8Array(),
_1969: () => globalThis.firebase_firestore.DocumentReference,
_1973: x0 => x0.path,
_1984: x0 => x0.metadata,
_1985: x0 => x0.ref,
_1986: (x0,x1) => x0.data(x1),
_1987: x0 => x0.exists(),
_2004: () => globalThis.firebase_firestore.Timestamp,
_2005: x0 => x0.seconds,
_2006: x0 => x0.nanoseconds,
_2038: x0 => x0.hasPendingWrites,
_2040: x0 => x0.fromCache,
_2045: x0 => x0.source,
_2064: x0 => x0.call(),
_2070: f => finalizeWrapper(f,x0 => dartInstance.exports._2070(f,x0)),
_2071: f => finalizeWrapper(f,x0 => dartInstance.exports._2071(f,x0)),
_2072: (x0,x1,x2) => globalThis.onSnapshot(x0,x1,x2),
_2073: (x0,x1) => globalThis.setDoc(x0,x1),
_2077: x0 => globalThis.doc(x0),
_2082: () => globalThis.getFirestore(),
_2088: x0 => new FieldPath(x0),
_2089: (x0,x1) => new FieldPath(x0,x1),
_2090: (x0,x1,x2) => new FieldPath(x0,x1,x2),
_2091: (x0,x1,x2,x3) => new FieldPath(x0,x1,x2,x3),
_2092: (x0,x1,x2,x3,x4) => new FieldPath(x0,x1,x2,x3,x4),
_2093: (x0,x1,x2,x3,x4,x5) => new FieldPath(x0,x1,x2,x3,x4,x5),
_2094: (x0,x1,x2,x3,x4,x5,x6) => new FieldPath(x0,x1,x2,x3,x4,x5,x6),
_2095: (x0,x1,x2,x3,x4,x5,x6,x7) => new FieldPath(x0,x1,x2,x3,x4,x5,x6,x7),
_2096: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => new FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8),
_2097: f => finalizeWrapper(f,() => dartInstance.exports._2097(f)),
_2098: (x0,x1) => x0.debug(x1),
_2099: f => finalizeWrapper(f,x0 => dartInstance.exports._2099(f,x0)),
_2100: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._2100(f,x0,x1)),
_2101: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
_2102: (x0,x1,x2) => x0.createPolicy(x1,x2),
_2103: (x0,x1) => x0.createScriptURL(x1),
_2104: (x0,x1,x2) => x0.createScript(x1,x2),
_2105: (x0,x1) => x0.appendChild(x1),
_2106: (x0,x1) => x0.appendChild(x1),
_2107: f => finalizeWrapper(f,x0 => dartInstance.exports._2107(f,x0)),
_2119: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_2120: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_2121: f => finalizeWrapper(f,x0 => dartInstance.exports._2121(f,x0)),
_2122: (x0,x1,x2) => x0.addEventListener(x1,x2),
_2123: f => finalizeWrapper(f,x0 => dartInstance.exports._2123(f,x0)),
_2124: x0 => x0.send(),
_2125: () => new XMLHttpRequest(),
_2137: (x0,x1) => x0.querySelector(x1),
_2138: (x0,x1) => x0.getAttribute(x1),
_2139: (x0,x1,x2) => x0.setAttribute(x1,x2),
_2151: (x0,x1) => x0.initialize(x1),
_2152: (x0,x1) => x0.initTokenClient(x1),
_2153: (x0,x1) => x0.initCodeClient(x1),
_2155: (x0,x1) => x0.warn(x1),
_2156: x0 => x0.disableAutoSelect(),
_2157: (x0,x1) => x0.getItem(x1),
_2159: (x0,x1,x2) => x0.setItem(x1,x2),
_2160: () => globalThis.removeSplashFromWeb(),
_2161: (x0,x1) => x0.matchMedia(x1),
_2172: x0 => new Array(x0),
_2175: (o, c) => o instanceof c,
_2179: f => finalizeWrapper(f,x0 => dartInstance.exports._2179(f,x0)),
_2180: f => finalizeWrapper(f,x0 => dartInstance.exports._2180(f,x0)),
_2206: (decoder, codeUnits) => decoder.decode(codeUnits),
_2207: () => new TextDecoder("utf-8", {fatal: true}),
_2208: () => new TextDecoder("utf-8", {fatal: false}),
_2209: v => stringToDartString(v.toString()),
_2210: (d, digits) => stringToDartString(d.toFixed(digits)),
_2214: o => new WeakRef(o),
_2215: r => r.deref(),
_2220: Date.now,
_2222: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_2223: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_2224: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_2225: () => typeof dartUseDateNowForTicks !== "undefined",
_2226: () => 1000 * performance.now(),
_2227: () => Date.now(),
_2228: () => {
      // On browsers return `globalThis.location.href`
      if (globalThis.location != null) {
        return stringToDartString(globalThis.location.href);
      }
      return null;
    },
_2229: () => {
        return typeof process != undefined &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
_2230: () => new WeakMap(),
_2231: (map, o) => map.get(o),
_2232: (map, o, v) => map.set(o, v),
_2233: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_2234: s => printToConsole(stringFromDartString(s)),
_2243: (o, t) => o instanceof t,
_2245: f => finalizeWrapper(f,x0 => dartInstance.exports._2245(f,x0)),
_2246: f => finalizeWrapper(f,x0 => dartInstance.exports._2246(f,x0)),
_2247: o => Object.keys(o),
_2248: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_2249: (handle) => clearTimeout(handle),
_2252: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_2254: () => new XMLHttpRequest(),
_2255: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_2256: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_2257: (x0,x1) => x0.send(x1),
_2258: x0 => x0.abort(),
_2259: x0 => x0.getAllResponseHeaders(),
_2266: f => finalizeWrapper(f,x0 => dartInstance.exports._2266(f,x0)),
_2267: f => finalizeWrapper(f,x0 => dartInstance.exports._2267(f,x0)),
_2268: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_2269: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
_2275: x0 => x0.trustedTypes,
_2276: (x0,x1) => x0.src = x1,
_2277: (x0,x1) => x0.createScriptURL(x1),
_2278: (x0,x1) => x0.debug(x1),
_2279: f => finalizeWrapper(f,x0 => dartInstance.exports._2279(f,x0)),
_2280: x0 => ({createScriptURL: x0}),
_2281: (x0,x1) => x0.appendChild(x1),
_2294: (x0,x1) => x0.key(x1),
_2295: x0 => x0.trustedTypes,
_2297: (x0,x1) => x0.text = x1,
_2299: (a, i) => a.push(i),
_2303: a => a.pop(),
_2304: (a, i) => a.splice(i, 1),
_2306: (a, s) => a.join(s),
_2307: (a, s, e) => a.slice(s, e),
_2309: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
_2310: a => a.length,
_2312: (a, i) => a[i],
_2313: (a, i, v) => a[i] = v,
_2315: a => a.join(''),
_2318: (s, t) => s.split(t),
_2319: s => s.toLowerCase(),
_2320: s => s.toUpperCase(),
_2321: s => s.trim(),
_2322: s => s.trimLeft(),
_2323: s => s.trimRight(),
_2325: (s, p, i) => s.indexOf(p, i),
_2326: (s, p, i) => s.lastIndexOf(p, i),
_2327: (o, offsetInBytes, lengthInBytes) => {
      var dst = new ArrayBuffer(lengthInBytes);
      new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
      return new DataView(dst);
    },
_2328: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_2329: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_2330: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_2331: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_2332: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_2333: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_2334: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_2336: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_2337: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_2338: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_2339: Object.is,
_2340: (t, s) => t.set(s),
_2342: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_2344: o => o.buffer,
_2345: o => o.byteOffset,
_2346: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_2347: (b, o) => new DataView(b, o),
_2348: (b, o, l) => new DataView(b, o, l),
_2349: Function.prototype.call.bind(DataView.prototype.getUint8),
_2350: Function.prototype.call.bind(DataView.prototype.setUint8),
_2351: Function.prototype.call.bind(DataView.prototype.getInt8),
_2352: Function.prototype.call.bind(DataView.prototype.setInt8),
_2353: Function.prototype.call.bind(DataView.prototype.getUint16),
_2354: Function.prototype.call.bind(DataView.prototype.setUint16),
_2355: Function.prototype.call.bind(DataView.prototype.getInt16),
_2356: Function.prototype.call.bind(DataView.prototype.setInt16),
_2357: Function.prototype.call.bind(DataView.prototype.getUint32),
_2358: Function.prototype.call.bind(DataView.prototype.setUint32),
_2359: Function.prototype.call.bind(DataView.prototype.getInt32),
_2360: Function.prototype.call.bind(DataView.prototype.setInt32),
_2363: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_2364: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_2365: Function.prototype.call.bind(DataView.prototype.getFloat32),
_2366: Function.prototype.call.bind(DataView.prototype.setFloat32),
_2367: Function.prototype.call.bind(DataView.prototype.getFloat64),
_2368: Function.prototype.call.bind(DataView.prototype.setFloat64),
_2374: s => stringToDartString(stringFromDartString(s).toUpperCase()),
_2375: s => stringToDartString(stringFromDartString(s).toLowerCase()),
_2377: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_2378: (x0,x1) => x0.exec(x1),
_2379: (x0,x1) => x0.test(x1),
_2380: (x0,x1) => x0.exec(x1),
_2381: (x0,x1) => x0.exec(x1),
_2382: x0 => x0.pop(),
_2386: (x0,x1,x2) => x0[x1] = x2,
_2388: o => o === undefined,
_2389: o => typeof o === 'boolean',
_2390: o => typeof o === 'number',
_2392: o => typeof o === 'string',
_2395: o => o instanceof Int8Array,
_2396: o => o instanceof Uint8Array,
_2397: o => o instanceof Uint8ClampedArray,
_2398: o => o instanceof Int16Array,
_2399: o => o instanceof Uint16Array,
_2400: o => o instanceof Int32Array,
_2401: o => o instanceof Uint32Array,
_2402: o => o instanceof Float32Array,
_2403: o => o instanceof Float64Array,
_2404: o => o instanceof ArrayBuffer,
_2405: o => o instanceof DataView,
_2406: o => o instanceof Array,
_2407: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_2409: o => {
            const proto = Object.getPrototypeOf(o);
            return proto === Object.prototype || proto === null;
          },
_2410: o => o instanceof RegExp,
_2411: (l, r) => l === r,
_2412: o => o,
_2413: o => o,
_2414: o => o,
_2415: b => !!b,
_2416: o => o.length,
_2419: (o, i) => o[i],
_2420: f => f.dartFunction,
_2421: l => arrayFromDartList(Int8Array, l),
_2422: l => arrayFromDartList(Uint8Array, l),
_2423: l => arrayFromDartList(Uint8ClampedArray, l),
_2424: l => arrayFromDartList(Int16Array, l),
_2425: l => arrayFromDartList(Uint16Array, l),
_2426: l => arrayFromDartList(Int32Array, l),
_2427: l => arrayFromDartList(Uint32Array, l),
_2428: l => arrayFromDartList(Float32Array, l),
_2429: l => arrayFromDartList(Float64Array, l),
_2430: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_2431: l => arrayFromDartList(Array, l),
_2432: stringFromDartString,
_2433: stringToDartString,
_2434: () => ({}),
_2435: () => [],
_2436: l => new Array(l),
_2437: () => globalThis,
_2438: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_2439: (o, p) => p in o,
_2440: (o, p) => o[p],
_2441: (o, p, v) => o[p] = v,
_2442: (o, m, a) => o[m].apply(o, a),
_2444: o => String(o),
_2445: (p, s, f) => p.then(s, f),
_2446: s => {
      let jsString = stringFromDartString(s);
      if (/[[\]{}()*+?.\\^$|]/.test(jsString)) {
          jsString = jsString.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
      }
      return stringToDartString(jsString);
    },
_2449: x0 => x0.index,
_2450: x0 => x0.groups,
_2451: x0 => x0.length,
_2453: (x0,x1) => x0[x1],
_2457: x0 => x0.flags,
_2458: x0 => x0.multiline,
_2459: x0 => x0.ignoreCase,
_2460: x0 => x0.unicode,
_2461: x0 => x0.dotAll,
_2462: (x0,x1) => x0.lastIndex = x1,
_2464: (o, p) => o[p],
_2465: (o, p, v) => o[p] = v,
_2466: (o, p) => delete o[p],
_2487: () => globalThis.window,
_2508: x0 => x0.matches,
_2512: x0 => x0.platform,
_2517: x0 => x0.navigator,
_2524: x0 => x0.status,
_2525: (x0,x1) => x0.responseType = x1,
_2527: x0 => x0.response,
_2528: f => finalizeWrapper(f,x0 => dartInstance.exports._2528(f,x0)),
_2529: f => finalizeWrapper(f,x0 => dartInstance.exports._2529(f,x0)),
_2530: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12) => ({client_id: x0,scope: x1,include_granted_scopes: x2,redirect_uri: x3,callback: x4,state: x5,enable_granular_consent: x6,enable_serial_consent: x7,login_hint: x8,hd: x9,ux_mode: x10,select_account: x11,error_callback: x12}),
_2531: f => finalizeWrapper(f,x0 => dartInstance.exports._2531(f,x0)),
_2532: f => finalizeWrapper(f,x0 => dartInstance.exports._2532(f,x0)),
_2533: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10) => ({client_id: x0,callback: x1,scope: x2,include_granted_scopes: x3,prompt: x4,enable_granular_consent: x5,enable_serial_consent: x6,login_hint: x7,hd: x8,state: x9,error_callback: x10}),
_2534: (x0,x1,x2,x3,x4,x5,x6) => ({scope: x0,include_granted_scopes: x1,prompt: x2,enable_granular_consent: x3,enable_serial_consent: x4,login_hint: x5,state: x6}),
_2535: () => globalThis.google.accounts.oauth2,
_2539: (x0,x1) => x0.revoke(x1),
_2548: x0 => x0.error,
_2551: x0 => x0.requestAccessToken(),
_2552: (x0,x1) => x0.requestAccessToken(x1),
_2555: x0 => x0.access_token,
_2556: x0 => x0.expires_in,
_2559: x0 => x0.token_type,
_2562: x0 => x0.error,
_2565: x0 => x0.type,
_2570: f => finalizeWrapper(f,x0 => dartInstance.exports._2570(f,x0)),
_2573: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15,x16) => ({client_id: x0,auto_select: x1,callback: x2,login_uri: x3,native_callback: x4,cancel_on_tap_outside: x5,prompt_parent_id: x6,nonce: x7,context: x8,state_cookie_domain: x9,ux_mode: x10,allowed_parent_origin: x11,intermediate_iframe_close_callback: x12,itp_support: x13,login_hint: x14,hd: x15,use_fedcm_for_prompt: x16}),
_2577: () => globalThis.google.accounts.id,
_2582: f => finalizeWrapper(f,x0 => dartInstance.exports._2582(f,x0)),
_2583: (x0,x1) => x0.prompt(x1),
_2606: x0 => x0.isNotDisplayed(),
_2608: x0 => x0.isSkippedMoment(),
_2610: x0 => x0.isDismissedMoment(),
_2614: x0 => x0.getNotDisplayedReason(),
_2617: x0 => x0.getSkippedReason(),
_2619: x0 => x0.getDismissedReason(),
_2622: x0 => x0.error,
_2624: x0 => x0.credential,
_2632: x0 => globalThis.onGoogleLibraryLoad = x0,
_2633: f => finalizeWrapper(f,() => dartInstance.exports._2633(f)),
_2667: (x0,x1) => x0.withCredentials = x1,
_2670: x0 => x0.responseURL,
_2671: x0 => x0.status,
_2672: x0 => x0.statusText,
_2673: (x0,x1) => x0.responseType = x1,
_2675: x0 => x0.response,
_4011: (x0,x1) => x0.src = x1,
_4013: (x0,x1) => x0.type = x1,
_4017: (x0,x1) => x0.async = x1,
_4019: (x0,x1) => x0.defer = x1,
_4021: (x0,x1) => x0.crossOrigin = x1,
_4023: (x0,x1) => x0.text = x1,
_4432: () => globalThis.window,
_4493: x0 => x0.location,
_4769: x0 => x0.trustedTypes,
_4770: x0 => x0.sessionStorage,
_4771: x0 => x0.localStorage,
_4787: x0 => x0.hostname,
_5212: x0 => x0.length,
_9407: () => globalThis.document,
_9498: x0 => x0.head,
_9863: (x0,x1) => x0.id = x1,
_15251: () => globalThis.console,
_15275: () => globalThis.window.flutterCanvasKit,
_15277: x0 => x0.name,
_15278: x0 => x0.message,
_15279: x0 => x0.code
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

