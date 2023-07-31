using System.Security.Claims;

namespace projekatSWE.Services
{
    public class UserServicess : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserServicess(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetMyName()
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name); //vraca usera
            }
            return result;
        }

        public string GetMyRole(){
            var result= string.Empty;
            if(_httpContextAccessor.HttpContext!= null){
                result= _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
            }
            return result;
        }
    }
}