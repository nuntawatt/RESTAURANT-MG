class FormValidator {
    static email(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    static password(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    }

    static phone(phone) {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone);
    }

    static required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    static name(name) {
        const regex = /^[a-zA-Z\s]{2,30}$/;
        return regex.test(name);
    }

    static getErrorMessage(field, value) {
        if (!this.required(value)) {
            return `${field} is required`;
        }

        switch (field.toLowerCase()) {
            case 'email':
                return this.email(value) ? '' : 'Invalid email format';
            case 'password':
                return this.password(value) ? '' : 'Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number';
            case 'phone':
                return this.phone(value) ? '' : 'Invalid phone number format (10 digits required)';
            case 'name':
                return this.name(value) ? '' : 'Name must be 2-30 characters long and contain only letters';
            default:
                return '';
        }
    }

    static validateForm(formData) {
        const errors = {};
        Object.keys(formData).forEach(field => {
            const error = this.getErrorMessage(field, formData[field]);
            if (error) {
                errors[field] = error;
            }
        });
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export default FormValidator;