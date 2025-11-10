let generateNavigationBar = document.querySelector('nav')

function stickBar(){
    if (window.pageYOffset >= 30) {
        generateNavigationBar.classList.add("sticky")
      } else {
        generateNavigationBar.classList.remove("sticky");
      }
}

async function checkToken() {
    const token = localStorage.getItem('userToken');
    if (!token) return false;

    try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem('userToken');
            return false;
        }

        const userData = await response.json();
        return [{ ...userData, token }];
    } catch (error) {
        console.error('Error checking token:', error);
        localStorage.removeItem('userToken');
        return false;
    }
}

async function manageShowBtnNavigationBar(){
    const haveToken = await checkToken();   // ✅ ต้อง await
    const getSignupAndLoginBtnBox = document.querySelector(".signup_And_login_BtnBx");
    const getAuthenticationBtnBox = document.querySelector(".authentication_uer_box");
    if(haveToken){
        getAuthenticationBtnBox.classList.add("haveToken");
        getSignupAndLoginBtnBox.classList.add("haveToken");
    }else{
        getSignupAndLoginBtnBox.classList.remove("haveToken");
        getAuthenticationBtnBox.classList.remove("haveToken");
    }
}

function generateNavigation(){
  generateNavigationBar.innerHTML = `
  <div class="container">
            <a href="" class="logo">
                <img src="./image/logo.png" alt=""> <p>KITCHEN</p></a>

          <div class="rightBx" id="navRightBox">

            <ul class="navBx">
                <li class="navlink"><a href="/index.html">Home</a></li>
                <li class="navlink"><a href="/about.html">About</a></li>
                <li class="navlink">             
                            <a href="/service.html">Service</a>             
                </li>
                <li class="navlink"><a href="/menu.html">Menu</a></li>
                <li class="navlink dropdownClick">
                    <p class="page">Pages <i class='bx bxs-down-arrow' ></i></p>
                     <div class="dropdownBox">
                        <ul>
                            <li><a href="/outTeam.html">Our Team</a></li>
                            <li><a href="/testimonial.html">Testimonial</a></li>
                            <li><a href="/booktable.html">Booking</a></li>
                        </ul>
                     </div>
                </li>
                <li class="navlink"><a href="/contact.html">Contact</a></li>
            </ul>

            <div class="burgerBar burgetBarClick" onclick="controlAllBtnNavigation('navBurger')">
                <i class='bx bx-menu'></i>
                <i class='bx bx-x'></i>
            </div>

            <div class="authentication_uer_box">
                <div class="cart_Bx" onclick="controlAllBtnNavigation('cart')">
                    <span class="cartNum">0</span>
                    <i class='bx bxs-cart-alt cartIcon'></i>
                    <div class="closeSlideBtn"><i class='bx bx-x'></i></div>
                </div>
                <div class="wishlist_Bx" onclick="controlAllBtnNavigation('wishlist')">
                    <span class="wishlistNum">0</span>
                    <i class='bx bxs-heart wishlistIcon'></i>
                    <div class="closeSlideBtn"><i class='bx bx-x'></i></div>
                </div>
            </div>

            <div class="user_menu_box">
                <div class="user_icon">
                    <i class='bx bxs-user'></i>
                </div>
                <div class="user_dropdown">
                    <a href="login.html" class="login-link">
                        <i class='bx bx-log-in'></i> Login
                    </a>
                    <a href="signup.html" class="signup-link">
                        <i class='bx bx-user-plus'></i> Sign Up
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="member.html" class="member-link">
                        <i class='bx bx-crown'></i> Membership
                    </a>
                </div>
            </div>

            <div class="cart_slide">
                <div class="cart_Details">
                   ${showCartItem()}
                </div>

                <div class="showTotalMenu">
                    <p class="tx">Sub Total</p>
                    <p class="price">0.00$</p>
                </div>

                <div class="btnBox">
                    <a href="/viewcart.html">Cart</a>
                    <a href="/checkout.html">Checkout</a>
                </div>
            </div>


            <div class="wishlist_slide">

                <div class="wishlist_detail">
                      ${showWishlistItem()}
                    <div class="wishlistMenu">
                        <div class="image"><img src="./image/menuImg/burger1.png" alt=""></div>
                        <div class="content">
                            <div class="menuName">
                                <p class="name">Chicken Burger</p>
                                <p class="category">burger</p>
                                <p class="price">$0</p>
                            </div>
                            <div class="cancel_wishlist"><i class='bx bx-x'></i></div>
                        </div>
                    </div>     

                </div>
                       <a href="/wishlist.html" class="viewWishlistBtn">View Wishlist</a>
            </div>

          </div>
        </div>
  `
  //the function will manage display (signup, login, account, cart, wishlist) btn in right navbar 
  manageShowBtnNavigationBar()
}

// Handle User Menu Dropdown
function setupUserMenuDropdown() {
    const userMenuBox = document.querySelector('.user_menu_box');
    const userIcon = userMenuBox?.querySelector('.user_icon');
    const userDropdown = userMenuBox?.querySelector('.user_dropdown');

    if (userMenuBox && userDropdown) {
        userIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.opacity = '1';
            userDropdown.style.visibility = 'visible';
            userDropdown.style.transform = 'translateY(0)';
            userDropdown.style.pointerEvents = 'auto';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuBox.contains(e.target)) {
                userDropdown.style.opacity = '0';
                userDropdown.style.visibility = 'hidden';
                userDropdown.style.transform = 'translateY(10px)';
                userDropdown.style.pointerEvents = 'none';
            }
        });

        // Add hover animation for dropdown items
        const dropdownLinks = userDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transition = 'all 0.3s ease';
            });
        });
    }
}

function controlAllBtnNavigation(keyCodeBtn){
  let burgerBtnClick = document.querySelector('.burgerBar')
  let navBar = document.querySelector('.navBx')
  let cartBtn = document.querySelector('.cart_Bx')
  let closeCartBarBtn = document.querySelector('.cart_Bx .closeSlideBtn')
  let cartBar = document.querySelector('.cart_slide')
  let wishlistBtn = document.querySelector('.wishlist_Bx')
  let wishlistSlide = document.querySelector('.wishlist_slide')
  let closeWishlistBarBtn = document.querySelector('.wishlist_Bx .closeSlideBtn')

  if(keyCodeBtn == "navBurger"){
    // show slide if use click btn
    burgerBtnClick.classList.toggle('active')
    navBar.classList.toggle('active')
    // remove show slide
    cartBtn.classList.remove('active')
    cartBar.classList.remove('active')
    wishlistSlide.classList.remove('active')
    wishlistBtn.classList.remove('active')

  }else if(keyCodeBtn =="cart"){
    // show slide if use click btn
    cartBtn.classList.toggle('active')
    cartBar.classList.toggle('active')
    // remove show slide
    wishlistSlide.classList.remove('active')
    wishlistBtn.classList.remove('active')
    burgerBtnClick.classList.remove('active')
    navBar.classList.remove('active')
  }
  else if(keyCodeBtn == "wishlist"){
    // show slide if use click btn
    wishlistSlide.classList.toggle('active')
    wishlistBtn.classList.toggle('active')
    // remove show slide
    cartBtn.classList.remove('active')
    cartBar.classList.remove('active')
    burgerBtnClick.classList.remove('active')
    navBar.classList.remove('active')
  }
}

// ---------------------------------------------------------------------------
//                   [ MANAGE CART ITEM IN NAVIGATION] 
// ---------------------------------------------------------------------------

// -------------- [ Cart Num ]---------------------
async function showQtyMenuCart() {
    if (await checkToken()) {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch cart');

            const cartData = await response.json();
            const totalQty = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
            
            const cartNum = document.querySelector('.cartNum');
            if (cartNum) {
                cartNum.innerHTML = totalQty;
                if (totalQty > 0) {
                    cartNum.classList.add('has-items');
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }
}

// --------- [Show Cart Item & Sub Total] -------------------
async function showCartItem() {
    if (await checkToken()) {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch cart');

            const cartData = await response.json();
            const cartContainer = document.querySelector('nav .cart_slide .cart_Details');
            const subTotalMenuBx = document.querySelector('nav .cart_slide .showTotalMenu .price');

            if (cartContainer) {
                const subTotal = cartData.items.reduce((sum, item) => 
                    sum + (parseFloat(item.price) * item.quantity), 0);

                // Create cart items with animation
                const cartHTML = cartData.items.map((item, index) => `
                    <div class="cartMenu" id=${item._id} 
                         style="animation: fadeIn 0.3s ease-out forwards ${index * 0.1}s">
                        <div class="image"><img src=${item.image} alt="${item.name}"></div>
                        <div class="content">
                            <div class="menuName">
                                <p class="name">${item.name}</p>
                                <p class="category">${item.category}</p>
                            </div>
                            <p class="quantity">x ${item.quantity}</p>
                            <p class="price">$ ${(item.price * item.quantity).toFixed(2)}</p>
                            <i class='bx bxs-trash' onclick="cancelMenuItem('${item._id}')"></i>
                        </div>
                    </div>
                `).join('');

                cartContainer.innerHTML = cartHTML;
                if (subTotalMenuBx) {
                    subTotalMenuBx.innerHTML = "$" + subTotal.toFixed(2);
                }
            }
        } catch (error) {
            console.error('Error showing cart items:', error);
        }
    }
}

// --------- [Cancel Menu Item] -------------------
// --------- [Cancel Menu Item] -------------------
async function cancelMenuItem(getMenuID) {
    if (await checkToken() && getMenuID) {
        try {
            const result = await Swal.fire({
                title: "Do you want to remove this item from your cart?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('userToken');
                const response = await fetch(`http://localhost:5000/api/cart/remove/${getMenuID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to remove item');

                // Animate item removal
                const cartItem = document.getElementById(getMenuID);
                if (cartItem) {
                    cartItem.style.transition = 'all 0.3s ease-out';
                    cartItem.style.opacity = '0';
                    cartItem.style.transform = 'translateX(-20px)';
                    setTimeout(() => cartItem.remove(), 300);
                }

                // Update cart count and total
                await showQtyMenuCart();
                await showCartItem();

                await Swal.fire({
                    title: "Success!",
                    text: "Item has been removed from your cart.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error removing item:', error);
            await Swal.fire({
                title: "Error!",
                text: "Failed to remove item. Please try again.",
                icon: "error"
            });
        }
    }
}

// --------- [Cancel Wishlist Item] -------------------
async function cancelWishlist(getWishlistID){
    if(await checkToken()){
        try {
            const result = await Swal.fire({
                title: "Do you want to remove this item from your wishlist?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            });

            if (result.isConfirmed) {
                const wishlistItem = document.getElementById(getWishlistID);
                if (wishlistItem) {
                    // Start remove animation
                    wishlistItem.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    wishlistItem.style.opacity = '0';
                    wishlistItem.style.transform = 'translateX(-20px)';
                }

                // Remove item from wishlist through API
                await fetch(`${API_URL}/wishlist/remove/${getWishlistID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${restaurantAPI.auth.getToken()}`
                    }
                });

                // Wait for animation
                await new Promise(r => setTimeout(r, 300));

                // Update UI
                await showQtyMenuWishlist();
                await showWishlistItem();

                await Swal.fire({
                    title: "Item Removed!",
                    text: "The item has been removed from your wishlist.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error removing wishlist item:', error);
            Swal.fire({
                title: "Error",
                text: "Failed to remove item. Please try again.",
                icon: "error"
            });
        }
    }
}

// ---------------------------------------------------------------------------
//                   [ MANAGE WISHLIST ITEM IN NAVIGATION] 
// ---------------------------------------------------------------------------

// --------------[ Wishlist Num ]-------------------
async function showQtyMenuWishlist(){
    if(await checkToken()){
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${restaurantAPI.auth.getToken()}`
                }
            });
            const wishlistData = await response.json();
            navAnimations.updateWishlistBadge(wishlistData.items.length);
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
        }
    }
} 

// --------- [Show Wishlist Item] -------------------
async function showWishlistItem(){
    if(await checkToken()){ 
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${restaurantAPI.auth.getToken()}`
                }
            });
            const wishlistData = await response.json();
            const wishlistContainer = document.querySelector('nav .wishlist_slide .wishlist_detail');
            
            if (!wishlistContainer) return;

            // Remove existing items with animation
            const existingItems = wishlistContainer.querySelectorAll('.wishlistMenu');
            existingItems.forEach((item, index) => {
                item.style.animation = `fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards ${index * 0.1}s`;
            });

            // Wait for animations to complete
            await new Promise(r => setTimeout(r, existingItems.length * 100 + 300));

            // Create and add new items with animation
            wishlistContainer.innerHTML = wishlistData.items.map((item, index) => `
                <div class="wishlistMenu" id=${item.id} style="animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards ${index * 0.1}s">
                    <div class="image"><img src=${item.image} alt=""></div>
                    <div class="content">
                        <div class="menuName">
                            <p class="name">${item.name}</p>
                            <p class="category">${item.category}</p>
                            <p class="price">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="cancel_wishlist" onclick="cancelWishlist(${item.id})">
                            <i class='bx bx-x'></i>
                        </div>
                    </div>
                </div>
            `).join("");

            // Add hover effect for wishlist items
            wishlistContainer.querySelectorAll('.wishlistMenu').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateX(-5px)';
                    item.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateX(0)';
                });
            });
        } catch (error) {
            console.error('Error showing wishlist items:', error);
        }
    }
}

// --------- [Cancel Wishlist Item] -------------------
function cancelWishlist(getWishlistID){
  if(checkToken()){
    let getUserData = checkToken()

    Swal.fire({
        title: "Do you want to cancel this food item in your wishlist? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
            let getUserWishlist = getUserData[0].wishlist
            let cancelWishlistItem = getUserWishlist.filter((data) => data.id != getWishlistID)
            let getAllUserData = JSON.parse(localStorage.getItem("userDataStorage")) || null
            let findUserDataIndex = getAllUserData.findIndex((data) => data.id == getUserData[0].id)
            getAllUserData[findUserDataIndex].wishlist = cancelWishlistItem
            
            localStorage.setItem("userDataStorage" , JSON.stringify(getAllUserData))
        
          Swal.fire({
            title: "Cancel Success!",
            text: "Your menu has been cancelled.",
            icon: "success"
          });
        }
      });
}

  }





// if user click screen we will update qty cart and wishlist in navigation bars realtime
document.addEventListener('click',() =>{
    showQtyMenuCart()
    showCartItem()
    showQtyMenuWishlist()
    showWishlistItem()
})

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navlink a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (currentPath === linkPath) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

window.addEventListener('load', async ()=>{
    stickBar();
    generateNavigation();
    await manageShowBtnNavigationBar();   // ✅
    showQtyMenuCart();
    showCartItem();
    showQtyMenuWishlist();
    showWishlistItem();
    setupUserMenuDropdown();
    setActiveNavLink();
});

window.addEventListener('scroll',() =>{
    stickBar()
})