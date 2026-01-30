namespace UserManagementApp.Dto
{
    public enum UserAction
    {
        Block,
        Unblock,
        Delete
    }

    public class UserActionDto
    {
        public List<int> UserIds { get; set; } = new();
        public UserAction Action { get; set; }
    }
}
