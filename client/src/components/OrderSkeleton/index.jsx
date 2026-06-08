import React from 'react';
import './index.css';

const OrderSkeleton = () => {
  // Renders a list of 3 mock order card cards to fill up the viewport screen area
  const skeletonItems = [1, 2, 3];

  return (
    <div className="order-skeleton-container">
      {/* 1. Page Header Title Loading Block */}
      <div className="skeleton-title shimmer"></div>

      {/* 2. Generating Mock Lists */}
      <div className="skeleton-orders-list">
        {skeletonItems.map((item) => (
          <div key={item} className="skeleton-order-card">
            
            {/* Top Order Row Section Metadata */}
            <div className="skeleton-card-header">
              <div className="skeleton-meta-left">
                <div className="skeleton-text-line short shimmer"></div>
                <div className="skeleton-text-line medium shimmer"></div>
              </div>
              <div className="skeleton-badge-right shimmer"></div>
            </div>

            {/* Main Product Display Area Row */}
            <div className="skeleton-card-body">
              <div className="skeleton-product-thumb shimmer"></div>
              <div className="skeleton-product-details">
                <div className="skeleton-text-line long shimmer"></div>
                <div className="skeleton-text-line medium shimmer"></div>
                <div className="skeleton-text-line short shimmer"></div>
              </div>
            </div>

            {/* Bottom Footer Pricing Row Summary Block */}
            <div className="skeleton-card-footer">
              <div className="skeleton-text-line medium shimmer"></div>
              <div className="skeleton-btn-mock shimmer"></div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSkeleton;
