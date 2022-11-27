import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';
import moment from 'moment'

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});

extend("numeric_comma", {
  params: ["numeric_comma"],
  validate: (value) => {
   // var pattern = /\d{1,2}[,.]\d{1,2}/;
    var pattern = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/;
    if (pattern.test(value)) {
      return true;
    }
    return false;
  },
  message:
    "The {_field_} may only contain numeric characters"
});



extend("mobile_number", {
  validate: (value) => {
   // var pattern = /\d{1,2}[,.]\d{1,2}/;
    var pattern = /(\d)\1{9}/g;
    if (pattern.test(value)) {
      return false;
    }
    return true;
  },
  message:
    "{_field_} is invalid"
});

extend("max_file_size", {
  params: ["max_size"],
  validate: (value, targetValue) => {
    console.log(value);
    console.log(targetValue);
    const maxSize = Math.pow(targetValue.max_size, 6) // Convert into Bytes
    if(value.size < maxSize) return false;
    return true;
  },
  message: (fieldName, args) => {
    return `The ${fieldName} file should be below ${args.max_size} mb.`
  }
});



extend("before_date", {
  params: ["target_date", "target_field_name"],
  validate: (value, targetValue) => {

    var d = moment(value, 'DD/MM/YYYY');
    var d_t = moment(targetValue.target_date, 'DD/MM/YYYY');
    if (moment(d).isAfter(d_t)) {
      return false;
    }
    else{return true;}

  },
  // message:"The {_field_} should be before the PASSPORT EXPIRY DATE  ",
  message: (fieldName, args) => {
    return `The ${fieldName} should be before the  ${args.target_field_name}`
  }
});


extend("within_days", {
  params: ["no_of_days"],
  validate: (value, targetValue) => {
    var d = moment(value, 'DD/MM/YYYY');
    var d_t = moment().add(targetValue.no_of_days, 'days');
    
    if (moment(d).isAfter(d_t)) {
      return false;
    }
    else{return true;}
  },
  message: (fieldName, args) => {
    return `The ${fieldName} should be within ${args.no_of_days} days.`
  }
});

extend('greaterThanZero',{
  message: field =>  field + ' needs to be > zero.',
  validate: (value) => {
    // value must be > zero
    if ( parseFloat(value.replace(/,/g, '')) > 0 ) return true;
    return false;
  }
 });
