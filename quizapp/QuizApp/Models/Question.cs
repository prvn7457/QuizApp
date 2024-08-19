using System.Collections.Generic;

namespace QuizApp.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public string QuestionType { get; set; }
        public List<Option> Options { get; set; }
    }
}
