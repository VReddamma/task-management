class AppException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_code: str = "APPLICATION_ERROR",
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

        super().__init__(message)


class ResourceNotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message, status_code=404, error_code="RESOURCE_NOT_FOUND"
        )


class BusinessRuleException(AppException):
    def __init__(self, message: str):
        super().__init__(
            message=message, status_code=400, error_code="BUSINESS_RULE_ERROR"
        )
