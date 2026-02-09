namespace UserManagementApp.Dto
{
    public enum UserAction
    {
        Block,
        Unblock,
        Delete,
        DeleteUnverified
    }

    public class UserActionDto
    {
        public List<int> UserIds { get; set; } = new();
        public int? CurrentUserId { get; set; } = null;
        public UserAction Action { get; set; }
    }
}
