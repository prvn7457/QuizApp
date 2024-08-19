using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Models;
using QuizApp.Services;
using System.Collections.Generic;

namespace QuizApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly QuestionService _questionService;

        public AnswersController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpPost]
        public IActionResult ValidateAnswers([FromBody] List<Answer> answers)
        {
            var result = _questionService.ValidateAnswers(answers);
            return Ok(new { Score = result.score, CorrectAnswersCount = result.correctAnswersCount });
        }

    }
}
