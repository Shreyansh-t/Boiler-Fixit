const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Services Requested
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service',
      required: true
    },
    serviceName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    scheduling: {
      type: String,
      enum: ['immediate', 'scheduled'],
      default: 'immediate'
    },
    scheduledDate: {
      type: Date,
      required: function() {
        return this.scheduling === 'scheduled';
      }
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    }
  }],
  
  // Address Information
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    addressType: {
      type: String,
      enum: ['home', 'work', 'other', 'manual', 'previous', 'current'],
      default: 'home'
    }
  },
  
  // Payment Information
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'digital_wallet'],
    default: 'card'
  },
  paymentId: {
    type: String, // Payment gateway transaction ID
    default: null
  },
  
  // Pricing Breakdown
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    serviceTax: {
      type: Number,
      required: true
    },
    commuteCharges: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  
  // Provider Assignment (only after payment)
  assignedProviders: [{
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider', // You'll need to create this model
      default: null
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['assigned', 'accepted', 'rejected', 'completed'],
      default: 'assigned'
    }
  }],
  
  // Request Status
  overallStatus: {
    type: String,
    enum: ['pending_payment', 'paid', 'provider_search', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending_payment'
  },
  
  // Additional Information
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  
  // Communication
  customerNotes: {
    type: String,
    default: ''
  },
  
  // Tracking
  estimatedCompletionTime: {
    type: Date
  },
  actualCompletionTime: {
    type: Date
  },
  
  // Ratings & Reviews (after completion)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceRequestSchema.index({ userId: 1, createdAt: -1 });
serviceRequestSchema.index({ isPaid: 1, overallStatus: 1 });
serviceRequestSchema.index({ 'address.zipCode': 1 });
serviceRequestSchema.index({ 'services.scheduledDate': 1 });

// Pre-save middleware to update overallStatus based on payment
serviceRequestSchema.pre('save', function(next) {
  if (this.isPaid && this.overallStatus === 'pending_payment') {
    this.overallStatus = 'paid';
  }
  this.updatedAt = Date.now();
  next();
});

// Method to check if request is ready for provider assignment
serviceRequestSchema.methods.isReadyForProviderAssignment = function() {
  return this.isPaid && this.paymentStatus === 'completed';
};

// Method to calculate total price
serviceRequestSchema.methods.calculateTotal = function() {
  const subtotal = this.services.reduce((sum, service) => {
    return sum + (service.price * service.quantity);
  }, 0);
  
  const serviceTax = subtotal * 0.18; // 18% tax
  const total = subtotal + serviceTax + this.pricing.commuteCharges;
  
  return {
    subtotal,
    serviceTax,
    total
  };
};

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest; 