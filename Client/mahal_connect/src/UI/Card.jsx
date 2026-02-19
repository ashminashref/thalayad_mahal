import React from 'react';
import { ChevronRight } from 'lucide-react';
import './Card.css';

function Card({ title, subtitle, icon, items = [], highlight = false, footer }) {
  return (
    <div className={`custom-card ${highlight ? 'community-highlight' : ''}`}>
      <div className="card-header">
        <div className="card-icon-wrapper">
          {icon}
        </div>
        <div className="card-title-container">
          <h3 className="card-title-text">{title}</h3>
          <p className="card-subtitle-text">{subtitle}</p>
        </div>
      </div>

      <div className="card-body-content mt-5">
        {items.map((item, index) => (
          <div key={index} className="card-list-item" onClick={item.onClick}>
            <div className="item-left-section">
              {item.icon && <span className="item-inline-icon">{item.icon}</span>}
              <div className="item-label-group">
                <span className="item-primary-name">{item.name}</span>
                {item.sub && <span className="item-secondary-sub">{item.sub}</span>}
                {item.amount && <span className="item-price-tag">{item.amount}</span>}
              </div>
            </div>
            
            <div className="item-right-section">
              {item.status && (
                <span className={`badge-status ${item.status}`}>
                  {item.status}
                </span>
              )}
              {item.showArrow && <ChevronRight size={16} className="item-chevron" />}
            </div>
          </div>
        ))}
      </div>

      {footer && (
        <div className="card-bottom-footer">
          <span>{footer}</span>
          <ChevronRight size={14} />
        </div>
      )}
    </div>
  );
}

export default Card;