# Category names in heap snapshots

When you take a heap snapshot in the Chrome DevTools, the default view for examining the heap snapshot is called Summary. In this view, most objects are categorized by constructor, where the constructor might be a built-in function such as Array or Object. However, some of the categories shown in this view aren't named based on constructors. Those categories are described in more detail here.

## `(array)`

This category includes various internal array-like objects which don't directly correspond to objects visible from JavaScript. For example, the contents of JavaScript `Array` objects are stored in a secondary internal object named `(object elements)[]`, to allow easy resizing. ***TODO:**: If [my proposal for treating backing storage as part of the object](https://docs.google.com/document/d/1To-QPe4sNwn-AOpsiIaftdlXrJIm26QJgi2dBVrlDd4/edit?usp=sharing) is accepted, add advice here and in the "system" category below to try the new feature.*

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

When V8 needs to take a substring, such as when JavaScript calls String.prototype.substr, it may choose to allocate a "sliced string" object rather than copying all of the relevant characters from the original string. This object contains a pointer to the original string and describes which range of characters from the original string to use. From the perspective of JavaScript code, these are just normal strings, and they behave like any other string.

## `system / Context`

Internal objects of type `system / Context` contain the local variables from a JavaScript scope which can be accessed by some nested function. Every function instance contains an internal pointer to the Context in which it executes, so that it can access those variables. Even though Context objects aren't directly visible from JavaScript, you do have direct control over them.

## `(system)`

This category contains various internal objects that haven't (yet) been categorized in any more meaningful way.
