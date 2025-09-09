// User database simulation
const users = {
  dev: {
    username: "dev",
    password: "dev123",
    telegram: "123456789",
    role: "dev",
  },
  admin1: {
    username: "admin1",
    password: "admin123",
    telegram: "987654321",
    role: "admin",
  },
  reseller1: {
    username: "reseller1",
    password: "reseller123",
    telegram: "555666777",
    role: "reseller",
  },
  member1: {
    username: "member1",
    password: "member123",
    telegram: "111222333",
    role: "member",
  },
}

// DOM Elements
const loginForm = document.getElementById("loginForm")
const toast = document.getElementById("toast")

// Event Listeners
loginForm.addEventListener("submit", handleLogin)

// Functions
function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value
  const telegram = document.getElementById("telegram").value.trim()

  // Show loading state
  const submitBtn = loginForm.querySelector('button[type="submit"]')
  submitBtn.classList.add("loading")

  // Simulate API call delay
  setTimeout(() => {
    const user = users[username]

    if (user && user.password === password && user.telegram === telegram) {
      // Store user session
      localStorage.setItem("currentUser", JSON.stringify(user))

      showToast("Login successful! Redirecting...", "success")

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1500)
    } else {
      showToast("Invalid credentials. Please try again.", "error")
      submitBtn.classList.remove("loading")
    }
  }, 2000)
}

function togglePassword() {
  const passwordInput = document.getElementById("password")
  const toggleBtn = document.querySelector(".toggle-password i")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleBtn.classList.remove("fa-eye")
    toggleBtn.classList.add("fa-eye-slash")
  } else {
    passwordInput.type = "password"
    toggleBtn.classList.remove("fa-eye-slash")
    toggleBtn.classList.add("fa-eye")
  }
}

function showToast(message, type = "success") {
  const toastIcon = toast.querySelector(".toast-icon")
  const toastMessage = toast.querySelector(".toast-message")

  // Set icon based on type
  if (type === "success") {
    toastIcon.className = "toast-icon fas fa-check-circle"
  } else if (type === "error") {
    toastIcon.className = "toast-icon fas fa-exclamation-circle"
  } else if (type === "warning") {
    toastIcon.className = "toast-icon fas fa-exclamation-triangle"
  }

  toastMessage.textContent = message
  toast.className = `toast ${type} show`

  // Hide toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

// Check if user is already logged in
if (localStorage.getItem("currentUser")) {
  window.location.href = "dashboard.html"
}

// Add input animations
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "translateY(-2px)"
  })

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "translateY(0)"
  })
})

// Add floating label effect
document.querySelectorAll(".input-wrapper input").forEach((input) => {
  input.addEventListener("input", function () {
    if (this.value) {
      this.classList.add("has-value")
    } else {
      this.classList.remove("has-value")
    }
  })
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    loginForm.dispatchEvent(new Event("submit"))
  }
})

// Add ripple effect to buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Add CSS for ripple effect
const style = document.createElement("style")
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
