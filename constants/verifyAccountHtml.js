exports.verifyAccountHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <link rel="stylesheet" href="./style.css" /> -->
    <title>Document</title>
    <style>
        * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a{
    text-decoration: none;
    color: inherit;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    background-color: aquamarine;
}

.background {
  background-color: skyblue;
  height: 15rem;
}

.container {
  padding: 1rem;
  position: absolute;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid black;
  border-radius: 0.5rem;
  max-width: 20rem;
}
.header {
  text-align: center;
  font-size: 3rem;
}
.text{
    text-align: center;
}
.btn-container {
  width: fit-content;
  margin: 1rem auto;
}

.btn {
  text-transform: capitalize;
  font-size: 1rem;
  border: none;
  outline: none;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: skyblue;
}

    </style>
  </head>

  <body>
    <div class="container">
      <h1 class="header">Welcome!!!</h1>
      <p class="text">
        We're excited to get you started. First you need to confirm. Just press
        the button below within 30 minutes
      </p>
      <div class="btn-container">
        <button class="btn">
            <a href="{{params.link}}">confirm account</a>
        </button>
      </div>
      <p class="text">If that doesn't work please click the link below</p>
      <p class="text"><a href="{{params.link}}">{{params.link}}</a></p>
    </div>
  </body>
</html>

`;
