# Category names in heap snapshots

When you take a heap snapshot in the Chrome DevTools, the default view for examining the heap snapshot is called Summary. In this view, most objects are categorized by constructor, where the constructor might be a built-in function such as Array or Object. However, some of the categories shown in this view aren't named based on constructors. Those categories are described in more detail here.

## `(array)`

This category includes various internal array-like objects which don't directly correspond to objects visible from JavaScript. For example, the contents of JavaScript `Array` objects are stored in a secondary internal object named `(object elements)[]`, to allow easy resizing. Similarly, the named properties in JavaScript objects are often stored in secondary internal objects named `(object properties)[]`, which are also listed in the `(array)` category. Starting in Chrome version 123, DevTools has an option to treat most of these internal arrays as if they were part of the containing object, which can help make shallow sizes more meaningful in many cases: in the DevTools settings, under Experiments, check the box entitled "In heap snapshots, treat backing store size as part of the containing object."

## `(compiled code)`

This category includes internal data that V8 needs so that it can run functions defined by JavaScript or WebAssembly. Each function can be represented in a variety of ways, from small and slow to large and fast. V8 automatically manages memory usage in this category: if a function runs many times, V8 uses more memory for that function so that it can run faster. If a function hasn't run in a while, V8 may clear out the internal data for that function.

## `(concatenated string)`

When V8 concatenates two strings together, such as with the JavaScript `+` operator, it may choose to represent the result internally as a "concatenated string". Rather than copying all of the characters of the two source strings into a new string, V8 allocates a small object with internal fields called `first` and `second`, which point to the two source strings. This lets V8 save time and memory. From the perspective of JavaScript code, these are just normal strings, and they behave like any other string.

## `InternalNode`

This category represents objects allocated outside V8, such as C++ objects defined by Blink. If you need more detail about an InternalNode because it's retaining a lot of memory, you can use [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing). In Chrome for Testing:

1. In the developer tools, in Settings, under Experiments, check the box entitled "Show option to expose internals in heap snapshots".
1. In the developer tools, in the Memory tab, check the box entitled "Expose internals (includes additional implementation-specific details)".
1. Reproduce the issue which caused something to be retained by an InternalNode.
1. Take a heap snapshot. In this heap snapshot, objects will have C++ class names instead of `InternalNode`.

## `(object shape)`

As described at [Fast Properties in V8](https://v8.dev/blog/fast-properties), V8 tracks "hidden classes" so that multiple objects with the same properties in the same order can be represented efficiently. This category contains those hidden classes, called `system / Map` (unrelated to JavaScript `Map`), and related data.

## `(sliced string)`

When V8 needs to take a substring, such as when JavaScript code calls [`String.prototype.substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring), V8 may choose to allocate a "sliced string" object rather than copying all of the relevant characters from the original string. This new object contains a pointer to the original string and describes which range of characters from the original string to use. From the perspective of JavaScript code, these are just normal strings, and they behave like any other string. If a sliced string is retaining a lot of memory, then the program may have triggered [Issue 2869: Substring of huge string retains huge string in memory](https://bugs.chromium.org/p/v8/issues/detail?id=2869), and might benefit from taking deliberate steps to "flatten" the sliced string.

## `system / Context`

Internal objects of type `system / Context` contain the local variables from a JavaScript scope which can be accessed by some nested function. Every function instance contains an internal pointer to the Context in which it executes, so that it can access those variables. Even though Context objects aren't directly visible from JavaScript, you do have direct control over them.

## `(system)`

This category contains various internal objects that haven't (yet) been categorized in any more meaningful way.
