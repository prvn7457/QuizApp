using Microsoft.Extensions.Configuration;
using QuizApp.Models;
using System.Collections.Generic;
using System.Data;
using System;
using System.Data.SqlClient;
using System.Linq;

namespace QuizApp.Services
{
    public class QuestionService
    {
        private readonly string _connectionString;

        public QuestionService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DbConnection");
        }

        public List<Question> GetQuestionsWithOptions()
        {
            var questions = new List<Question>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("usp_GetQuestions", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int questionId = Convert.ToInt32(reader["Id"]);

                        // Check if the question already exists
                        var question = questions.FirstOrDefault(q => q.Id == questionId);
                        if (question == null)
                        {
                            // If not, create a new question object and add it to the list
                            question = new Question
                            {
                                Id = questionId,
                                QuestionText = reader["QuestionText"].ToString(),
                                QuestionType = reader["QuestionType"].ToString(),
                                Options = new List<Option>()
                            };

                            questions.Add(question);
                        }

                        // Add the option to the corresponding question
                        var option = new Option
                        {
                            OpId = Convert.ToInt32(reader["OpId"]),
                            QuestionId = questionId,
                            Options = reader["Options"].ToString()
                        };
                        question.Options.Add(option);
                    }
                }
            }

            return questions;
        }

        public (int score, int correctAnswersCount) ValidateAnswers(List<Answer> submittedAnswers)
        {
            int score = 0;
            int correctAnswersCount = 0;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                foreach (var answer in submittedAnswers)
                {
                    SqlCommand cmd = new SqlCommand("Sp_Chkans", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@QuestionId", answer.QuestionId);
                    cmd.Parameters.AddWithValue("@OptionId", answer.OptionId);

                    int result = Convert.ToInt32(cmd.ExecuteScalar());
                    if (result > 0)
                    {
                        correctAnswersCount++; // Increment the count for each correct answer
                        score += 5; // Assign 5 points for each correct answer
                    }
                }
            }

            return (score, correctAnswersCount);
        }

    }

}
