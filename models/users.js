const mongoose = require('mongoose')

const bcrypt = require('bcryptjs');

const validator = require('validator');
let usersSchema = mongoose.Schema({


    firstName: {
        type: String,
        // required: true,
        trim: true
      },
      lastName: {
        type: String,
        // required: true,
        trim: true
      },
      jobtitle: {
        type: String,
        // required: true,
        trim: true
      },
      email: {
        type: String,
        // required: [true, 'Email address is required'],
        // unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
      },
      password: {
        type: String,
        // required: true,
        minLength: 6
      },
      profileName: {
        type: String,
        // required: true,
        unique: true,
        trim: true
      },
      username: {
        type: String,
        required: true,
        unique: true
      },
      // jobTitle: { type: String, required: true, trim: true },

      profilePicture: {
        type: String,
        default: './static/user.png'
      },
      bio: { type: String, trim: true },

      skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],

      role: {
        type: String,
        enum: ['client', 'freelancer'],
        // required: true
      },
      location: {
        type: String,
        // required: true
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      projectCompletionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      onTimeDeliveryRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
      }],
      availableBalance: {
        type: Number,
        default: 0
      },
      pendingBalance: {
        type: Number,
        default: 0
      },
      totalBalance: {
        type: Number,
        default: 0
      },
      withdrawableBalance: {
        type: Number,
        default: 0
      },
      averageResponseTime: {
        type: Number,
        default: 0
      },
      completedProjects: {
        type: Number,
        default: 0
      },
      portfolio: [{
        title: String,
        description: String,
        link: String,
        image: String
      }],
      languages: [{
        language: String,
        proficiency: {
          type: String,
          enum: ['Basic', 'Conversational', 'Fluent', 'Native']
        }
      }],
      hourlyRate: {
        type: Number,
        min: 0
      },
      statistics: {
        completionRate: { type: Number, default: 0 },
        onTimeDeliveryRate: { type: Number, default: 0 },
        averageResponseTime: { type: Number, default: 0 },
        totalProjects: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 }
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      joinDate: {
        type: Date,
        default: Date.now
      }
    }, { timestamps: true });
    
usersSchema.pre('save',async function(next) {
    let salt=await bcrypt.genSalt(10);
    
    let hashedPassword= await bcrypt.hash(this.password, salt)
    
    this.password=hashedPassword
    
    next();
    })

const userModel = mongoose.model('user',usersSchema)

module.exports=userModel




// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const validator = require('validator');

// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email address is required'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Invalid email address']
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: 6
//   },
//   profileName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   profilePicture: {
//     type: String,
//     default: './static/user.png'
//   },
//   bio: {
//     type: String
//   },
//   skills: [{
//     type: String,
//     trim: true
//   }],
//   role: {
//     type: String,
//     enum: ['client', 'freelancer'],
//     required: true
//   },
//   location: {
//     type: String,
//     required: true
//   },
//   rating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   },
//   projectCompletionRate: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   onTimeDeliveryRate: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   averageResponseTime: {
//     type: Number,
//     default: 0
//   },
//   completedProjects: {
//     type: Number,
//     default: 0
//   },
//   portfolio: [{
//     title: String,
//     description: String,
//     link: String
//   }],
//   languages: [{
//     language: String,
//     proficiency: {
//       type: String,
//       enum: ['Basic', 'Conversational', 'Fluent', 'Native']
//     }
//   }],
//   hourlyRate: {
//     type: Number,
//     min: 0
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   joinDate: {
//     type: Date,
//     default: Date.now
//   }
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;