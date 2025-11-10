class ErrorHandler {
    static async handle(error, context = '') {
        console.error(`Error in ${context}:`, error);

        // Network errors
        if (!navigator.onLine) {
            return this.showError('Network Error', 'Please check your internet connection and try again.');
        }

        // Authentication errors
        if (error.message.includes('authentication') || error.message.includes('401')) {
            localStorage.clear();
            this.showError('Authentication Error', 'Please login again.');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
            return;
        }

        // Validation errors
        if (error.message.includes('validation')) {
            return this.showError('Validation Error', error.message);
        }

        // Server errors
        if (error.message.includes('500')) {
            return this.showError('Server Error', 'Something went wrong. Please try again later.');
        }

        // Default error
        return this.showError('Error', error.message || 'Something went wrong. Please try again.');
    }

    static showError(title, message) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonColor: '#ff6b6b'
        });
    }

    static showSuccess(title, message) {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            timer: 1500,
            showConfirmButton: false
        });
    }

    static showLoading(message = 'Please wait...') {
        Swal.fire({
            title: message,
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    }

    static closeLoading() {
        Swal.close();
    }
}

export default ErrorHandler;