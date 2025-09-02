
const Avatar = require('avatar-initials');


function generateAvatar() {
    const initial_png = Avatar.initialAvatar({
      initials: 'MC',
      initial_fg: '#888888',
      initial_bg: '#f4f6f7',
      initial_size: 0, // Defaults to height / 2
      initial_weight: 100,
      initial_font_family: "'Lato', 'Lato-Regular', 'Helvetica Neue'",
    });
  return initial_png;
}



module.exports = {
  generateAvatar
};