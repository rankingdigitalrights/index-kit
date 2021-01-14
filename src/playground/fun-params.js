function printLetters(a, b, { c = "x", d, e }) {
  console.log(a);
  console.log(b);
  console.log(c);
  console.log(d);
  console.log(e);
}

printLetters("a", "b", { d: "d", e: "e" });
