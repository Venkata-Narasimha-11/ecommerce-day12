import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, AlertCircle, Zap, Star, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { toast } from '../ui/sonner';

export const ProductCard = ({ product }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Pseudo-random rating based on product ID for Amazon look
  const ratingVal = (4.0 + ((product.id * 3) % 9) / 10).toFixed(1);
  const ratingCount = 80 + (product.id * 147) % 2400;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAdmin) {
      toast.warning("Admin Access Detected", {
        description: "Administrators have store management access only and cannot purchase products.",
      });
      return;
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (isOutOfStock) return;

    setAdding(true);
    setErrorMsg('');
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      toast.success('Added to Cart! 🛒', {
        description: `${product.name} added to your shopping cart.`,
      });
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add item to cart';
      setErrorMsg(msg);
      toast.error('Could not add to cart', { description: msg });
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (isAdmin) {
      toast.warning("Admin Access Detected", {
        description: "Administrators cannot place retail orders. Please use a customer account.",
      });
      return;
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent('/checkout'));
      return;
    }
    if (isOutOfStock) return;

    setBuying(true);
    setErrorMsg('');
    try {
      await addToCart(product.id, 1);
      navigate('/checkout');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to process purchase';
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div
      className="card flex flex-col justify-between"
      style={{
        height: '100%',
        padding: '1.25rem',
        border: isOutOfStock ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
        position: 'relative',
      }}
    >
      <div>
        {/* Product Image / Placeholder */}
        <Link to={`/products/${product.id}`} style={{ display: 'block', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '100%',
              height: '190px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isOutOfStock ? 'grayscale(80%)' : 'none',
                }}
              />
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No Image</span>
            )}

            {/* Out of Stock Ribbon */}
            {isOutOfStock && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(220, 38, 38, 0.95)',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Out of Stock
              </div>
            )}

            {/* Wishlist Heart Icon (Customers Only) */}
            {!isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-transform active:scale-90 shadow-sm border border-border/60 cursor-pointer"
                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart
                  size={15}
                  className={isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-foreground"}
                />
              </button>
            )}
          </div>
        </Link>

        {/* Category & Prime Badge */}
        <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
          {product.category && (
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
              {product.category.name}
            </span>
          )}
          {!isOutOfStock && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                color: '#00a8e1',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontStyle: 'italic',
              }}
            >
              <Zap size={12} fill="#00a8e1" /> prime
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: '0.4rem',
              color: 'var(--text-primary)',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Amazon Star Rating */}
        <div className="flex items-center gap-1" style={{ marginBottom: '0.6rem' }}>
          <div className="flex items-center" style={{ color: '#f59e0b' }}>
            <Star size={13} fill="#f59e0b" />
            <Star size={13} fill="#f59e0b" />
            <Star size={13} fill="#f59e0b" />
            <Star size={13} fill="#f59e0b" />
            <Star size={13} fill="#f59e0b" opacity={0.4} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {ratingVal} ({ratingCount})
          </span>
        </div>

        {/* Amazon Stock Urgency Indicator */}
        <div style={{ marginBottom: '0.75rem', minHeight: '20px' }}>
          {isOutOfStock ? (
            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
              ❌ Currently Unavailable / Out of Stock
            </span>
          ) : isLowStock ? (
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>
              ⚠️ Only {product.stock} left in stock - order soon.
            </span>
          ) : (
            <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
              ✓ In Stock ({product.stock} available)
            </span>
          )}
        </div>
      </div>

      {/* Footer: Price & Amazon Action Buttons */}
      <div>
        {errorMsg && (
          <p
            className="flex items-center gap-1"
            style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: '0.5rem' }}
          >
            <AlertCircle size={12} />
            <span>{errorMsg}</span>
          </p>
        )}

        <div className="flex items-baseline gap-2" style={{ marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${Number(product.price).toFixed(2)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
            ${(Number(product.price) * 1.35).toFixed(2)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
            Save 26%
          </span>
        </div>

        {/* Action Buttons: Admin Mode vs Customer Mode */}
        {isAdmin ? (
          <div className="pt-1">
            <Link to="/admin" className="w-full">
              <button
                type="button"
                className="btn w-full flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '20px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <ShieldCheck size={14} />
                <span>Admin: Manage in Hub</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Add to Cart (Yellow) */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding || buying}
              className="btn"
              style={{
                flex: 1,
                backgroundColor: isOutOfStock ? '#475569' : '#ffd814',
                color: isOutOfStock ? '#94a3b8' : '#0f1111',
                fontWeight: 700,
                padding: '0.45rem 0.6rem',
                fontSize: '0.8rem',
                borderRadius: '20px',
                border: 'none',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              {adding ? (
                <span>Adding...</span>
              ) : added ? (
                <>
                  <Check size={14} color="#059669" />
                  <span>Added</span>
                </>
              ) : isOutOfStock ? (
                <span>Unavailable</span>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Buy Now (Orange) */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || adding || buying}
              className="btn"
              style={{
                flex: 1,
                backgroundColor: isOutOfStock ? '#334155' : '#ffa41c',
                color: isOutOfStock ? '#64748b' : '#0f1111',
                fontWeight: 700,
                padding: '0.45rem 0.6rem',
                fontSize: '0.8rem',
                borderRadius: '20px',
                border: 'none',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              {buying ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Zap size={14} />
                  <span>Buy Now</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
