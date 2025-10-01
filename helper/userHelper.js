//Suử dụng thư viên bcrypt để băm(hash) mật khâur để so sánh giúp kiểm tra có khớp mk đã lưu không
const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.log(error);
    }
}

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}


module.exports = { hashPassword, comparePassword }