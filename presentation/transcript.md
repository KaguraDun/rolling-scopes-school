# Presentation transcript
1. Hi, my name is Vasily Kovnev and I would like to talk about the type script.
1. TypeScript builds on JavaScript and offers all of JavaScript’s features, and an additional layer on top of these: TypeScript’s type system. Type script is compiled into java script, so the usual java script code will also work in typescript.
1. Whats benefit. Due to static typing, the code becomes clearer, readability is improved.
TypeScript helps you avoid many of the painful bugs because type checking in your code.
TypeScript uses more oop features like interfaces.
As a consequence of the above - TypeScript saves developer time

1. there are 2 options for specifying an array.
Tuple types allow you to express an array with a fixed number of elements whose types are known, but need not be the same. For example, you may want to represent a value as a pair of a string and a number:

1. A helpful addition to the standard set of datatypes from JavaScript is the enum. As in languages like C#, an enum is a way of giving more friendly names to sets of numeric values.
A handy feature of enums is that you can also go from a numeric value to the name of that value in the enum.

1. We may need to describe the type of variables that we do not know when we are writing an application. These values may come from dynamic content – e.g. from the user – or we may want to intentionally accept all values in our API. In these cases, we want to provide a type that tells the compiler and future readers that this variable could be anything, so we give it the unknown type.
1. In some situations, not all type information is available or its declaration would take an inappropriate amount of effort. These may occur for values from code that has been written without TypeScript or a 3rd party library. In these cases, we might want to opt-out of type checking. To do so, we label these values with the any type:
The any type is a powerful way to work with existing JavaScript, allowing you to gradually opt-in and opt-out of type checking during compilation.

1. void is a opposite of any: the absence of having any type at all. You may commonly see this as the return type of functions that do not return a value. Colon after the function brackets is the return type

1. The never type represents the type of values that never occur. For instance, never is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns. 

1. object types can be described as in example 1, or by using interface example 2

1. One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural subtyping”. In TypeScript, interfaces fill the role of naming these types, and are a powerful way of defining contracts within your code as well as contracts with code outside of your project.
The easiest way to see how interfaces work is to start with a simple example:
The type checker checks the call to printLabel. The printLabel function has a single parameter that requires that the object passed in has a property called label of type string. Notice that our object actually has more properties than this, but the compiler only checks that at least the ones required are present and match the types required. There are some cases where TypeScript isn’t as lenient, which we’ll cover in a bit.

1. We can write the same example again, this time using an interface to describe the requirement of having the label property that is a string:
The interface LabeledValue is a name we can now use to describe the requirement in the previous example. It still represents having a single property called label that is of type string. Notice we didn’t have to explicitly say that the object we pass to printLabel implements this interface like we might have to in other languages. Here, it’s only the shape that matters. If the object we pass to the function meets the requirements listed, then it’s allowed.
It’s worth pointing out that the type checker does not require that these properties come in any sort of order, only that the properties the interface requires are present and have the required type.

1. Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. These optional properties are popular when creating patterns like “option bags” where you pass an object to a function that only has a couple of properties filled in.
Some properties should only be modifiable when an object is first created. You can specify this by putting readonly before the name of the property:

1. Functions are the fundamental building block of any application in JavaScript. They’re how you build up layers of abstraction, mimicking classes, information hiding, and modules. In TypeScript, while there are classes, namespaces, and modules, functions still play the key role in describing how to do things. TypeScript also adds some new capabilities to the standard JavaScript functions to make them easier to work with.
To begin, just as in JavaScript, TypeScript functions can be created both as a named function or as an anonymous function. This allows you to choose the most appropriate approach for your application, whether you’re building a list of functions in an API or a one-off function to hand off to another function.

1. We can add types to each of the parameters and then to the function itself to add a return type. TypeScript can figure the return type out by looking at the return statements, so we can also optionally leave this off in many cases.
A function’s type has the same two parts: the type of the arguments and the return type. When writing out the whole function type, both parts are required. We write out the parameter types just like a parameter list, giving each parameter a name and a type. 
As long as the parameter types line up, it’s considered a valid type for the function, regardless of the names you give the parameters in the function type.
The second part is the return type. We make it clear which is the return type by using an arrow (=>) between the parameters and the return type. As mentioned before, this is a required part of the function type, so if the function doesn’t return a value, you would use void instead of leaving it off.
Of note, only the parameters and the return type make up the function type. Captured variables are not reflected in the type. In effect, captured variables are part of the “hidden state” of any function and do not make up its API.

1. Due to time constraints, I have only covered the most basic things in type sсript. but I hope I was able to convey a general representation of the language. Thank you for your attention!