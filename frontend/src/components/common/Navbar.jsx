import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  User,
  LogOut,
  Store,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  Heart,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { toast } from "../ui/sonner";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                Guntur Store
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Fullstack Hub
              </span>
            </div>
          </Link>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive("/")
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Catalog
            </Link>
          </nav>
        </div>

        {/* Right Action Icons & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Dark / Light / System Theme Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 transition-transform rotate-0" />
                ) : theme === "light" ? (
                  <Sun className="h-4 w-4 transition-transform rotate-0" />
                ) : (
                  <Laptop className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel className="text-xs">Theme Strategy</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                <Sun className="h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                <Moon className="h-4 w-4" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                <Laptop className="h-4 w-4" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wishlist Trigger for Customers */}
          {!isAdmin && (
            <Link to="/wishlist">
              <Button
                variant={isActive("/wishlist") ? "secondary" : "ghost"}
                size="sm"
                className="relative gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
                aria-label={`Wishlist with ${wishlist.length} items`}
              >
                <Heart className={`h-4 w-4 ${wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
                <span className="hidden md:inline text-xs font-semibold">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* Cart Trigger for Customers vs Admin Hub shortcut for Admins */}
          {isAdmin ? (
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "secondary" : "outline"}
                size="sm"
                className="gap-1.5 border-amber-500/40 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 font-bold"
              >
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span className="hidden sm:inline text-xs">Admin Hub</span>
              </Button>
            </Link>
          ) : (
            <Link to="/cart">
              <Button
                variant={isActive("/cart") ? "secondary" : "outline"}
                size="sm"
                className="relative gap-2 border-border/80"
                aria-label={`Shopping cart with ${cart.total_items} items`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                {cart.total_items > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow-sm">
                    {cart.total_items}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* User Auth controls */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 border border-border/50 px-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline font-medium text-xs max-w-[100px] truncate">
                    {user?.username}
                  </span>
                  {isAdmin && (
                    <Badge variant="warning" className="text-[10px] px-1 py-0 hidden lg:inline-flex">
                      Admin
                    </Badge>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user?.full_name || user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <div className="pt-1">
                      <Badge variant={isAdmin ? "warning" : "secondary"} className="text-[10px]">
                        Role: {user?.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAdmin ? (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer font-semibold text-amber-500">
                    <ShieldCheck className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Admin Control Hub</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/wishlist")} className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4 text-rose-500" />
                      <span>My Wishlist ({wishlist.length})</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")} className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-xs">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
