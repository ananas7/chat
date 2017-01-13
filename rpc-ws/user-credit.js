function UserCredit() {
    this.credit = 100;
    this.plus();
}

UserCredit.prototype.minus = function() {
    const newCredit = this.credit - 10;
    this.credit = (newCredit < 0) ? 0 : newCredit;
};

UserCredit.prototype.plus = function() {
    setInterval(() => {
        const newCredit = this.credit + 10;
        this.credit = (newCredit > 100) ? 100 : newCredit;
    }, 120000);
};

UserCredit.prototype.access = function() {
    return this.credit > 0;
};

module.exports = UserCredit;