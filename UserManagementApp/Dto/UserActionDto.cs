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
        public UserAction Action { get; set; }
    }
}
