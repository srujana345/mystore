let products = [];
let orders = [];
let cart = {};
let users = [];
let user = {};
let total = 0;

const addToCart = (id) => {
  if (!cart[id]) cart[id] = 1;
  showCart();
};

const increment = (id) => {
  cart[id] = cart[id] + 1;
  showCart();
};

const decrement = (id) => {
  cart[id] = cart[id] - 1;
  if (cart[id] < 1) delete cart[id];
  showCart();
};

const showTotal = () => {
  total = products.reduce((sum, value) => {
    return sum + value.price * (cart[value.id] || 0);
  }, 0);
  document.getElementById("divTotal").innerHTML = `Order Value: $${total}`;
};

const showOrders = () => {
  let str = "<div style='padding:30px'><h3>My Orders</h3>";
  orders.map((value) => {
    if (value.customer === user.email) {
      str += `
      <div>
      ${value.customer} - 
      $${value.orderValue} - 
      ${Object.keys(value.items).length} items - 
      ${value.status}
      </div>`;
    }
  });
  document.getElementById("divProducts").innerHTML = str + "</div>";
};

const showMain = () => {
  document.body.className = "mystore-page"; // Add a specific class to the body
  let str = `
  <div class="container" style="background-color: white;">
      <div class="header">
        <h1>My Store</h1>
        <div class='menu'>
         <li onclick='showProducts()'>Home</li>
          <li onclick='showOrders()'>Orders</li>
          <li onclick="displayCart()">Cart:<span id="items"></span></li>
          <li onclick='logout()'>Logout</li>
        </div>
      </div>
      <div class="productBlock">
        <div id="divProducts"></div>
      </div>
      <div id="divCartBlock" class="cartBlock">
        <h3>My Cart</h3>
        <div id="divCart"></div>
        <div id="divTotal"></div>
        <button onclick="hideCart()">Close</button>
      </div>
        <hr>
    <h4>@Copyright 2025. All rights reserved.</h4>
    </div>
  `;
  document.getElementById("root").innerHTML = str;
  showProducts();
};

const logout = () => {
  user = {};
  cart = {};
  showLogin();
};

const placeOrder = () => {
  const obj = {
    customer: user.email,
    items: { ...cart },
    orderValue: total,
    status: "pending",
  };
  orders.push(obj);
  cart = {};
  showCart();
  hideCart();
  showOrders();
};

const showCart = () => {
  let str = "";
  products.map((value) => {
    if (cart[value.id]) {
      str += `
        <li>${value.name} - $${value.price} 
        <button onclick='decrement(${value.id})'>-</button> 
        ${cart[value.id]} 
        <button onclick='increment(${value.id})'>+</button> 
        = $${value.price * cart[value.id]}</li>`;
    }
  });
  str += `<button onclick='placeOrder()'>Place Order</button>`;
  document.getElementById("divCart").innerHTML = str;
  let count = Object.keys(cart).length;
  document.getElementById("items").innerHTML = count;
  showTotal();
};

const displayCart = () => {
  document.getElementById("divCartBlock").style.left = "80%";
};

const hideCart = () => {
  document.getElementById("divCartBlock").style.left = "100%";
};

function showLogin() {
  let str = `
    <div class="container" style="width:850px; height: 600px;">
      <div class="form-box login">
        <form onsubmit="event.preventDefault(); chkUser();">
          <h2>Login</h2>
          <div class="input-box">
            <input type="text" class="form-control" id="emailOrUsername" placeholder="Email or Username" required />
          </div>
          <div class="input-box">
            <input type="password" class="form-control" id="password" placeholder="Password" required />
          </div>
          <div class="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" class="btn">Login</button>
          <p id="msg" style="color:red;"></p>
        </form>
      </div>

      <div class="form-box register">
        <form onsubmit="event.preventDefault(); addUser();">
          <h2>Register</h2>
          <div class="input-box">
            <input type="text" id="name" class="form-control" placeholder="Username" required />
          </div>
          <div class="input-box">
            <input type="email" id="email" class="form-control" placeholder="Email" required />
          </div>
          <div class="input-box">
            <input type="password" id="regPassword" class="form-control" placeholder="Password" required />
          </div>
          <div class="input-box">
            <input type="date" id="dob" class="form-control" required />
          </div>
          <button type="submit" class="btn">Register</button>
        </form>
      </div>

      <div class="toggle-box">
        <div class="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button class="btn register-btn">Register</button>
        </div>
        <div class="toggle-panel toggle-right">
          <h1>Welcome back!</h1>
          <p>Already have an account?</p>
          <button class="btn login-btn">Login</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("root").innerHTML = str;

  const container = document.querySelector(".container");
  const registerBtn = document.querySelector(".register-btn");
  const loginBtn = document.querySelector(".login-btn");

  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
  });

  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });
}

function chkUser() {
  let input = document.getElementById("emailOrUsername").value;
  let password = document.getElementById("password").value;
  let found = false;
  for (let i = 0; i < users.length; i++) {
    if (
      (users[i].email === input || users[i].name === input) &&
      users[i].password === password
    ) {
      user = users[i];
      found = true;
      break;
    }
  }
  if (found) {
    cart = {};
    showMain();
  } else {
    document.getElementById("msg").innerHTML = "Access Denied: Invalid credentials";
  }
}

function addUser() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("regPassword").value;
  let dob = document.getElementById("dob").value;

  if (name && email && password && dob) {
    let userObj = {
      name: name,
      email: email,
      password: password,
      dob: dob,
      balance: 0,
    };
    users.push(userObj);
    user = userObj;
    cart = {};
    alert("Registration Successful! Logged in automatically.");
    showMain();
  } else {
    alert("Please fill all fields!");
  }
}

const showProducts = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      let str = "<div class='row'>";
      products.map((value) => {
        str += `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${value.image}" class="card-img-top" alt="${value.name}">
              <div class="card-body">
                <h5 class="card-title">${value.name}</h5>
                <p class="card-text">${value.desc}</p>
                <h6 class="card-subtitle mb-2 text-muted">$${value.price}</h6>
                
                <div class="cart-button">
                  <button onclick="decrement(${value.id})">-</button>
                  <button onclick="addToCart(${value.id})">Add to Cart</button>
                  <button onclick="increment(${value.id})">+</button>
                </div>

              </div>
            </div>
          </div>
        `;
      });
      str += "</div>";
      document.getElementById("divProducts").innerHTML = str;
    });
};


// Initial load
showLogin();
