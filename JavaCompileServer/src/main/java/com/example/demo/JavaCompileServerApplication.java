package com.example.demo;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

import org.json.simple.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jackson.JsonObjectSerializer;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@SpringBootApplication
public class JavaCompileServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaCompileServerApplication.class, args);
	}

	@GetMapping("/")
	public static String test() {
		return "Java SpringBoot Server is Running";
	}

	public static String getPath(UserProblemSet ups) {
		StringBuilder path = new StringBuilder();
		path.append("../../JavaFile");

		File JavaFileFolder = new File(path.toString());
		if (!JavaFileFolder.exists()) {
			try {
				if (JavaFileFolder.mkdir()) {
					System.out.println("JavaFileFolder create success");
				} else {
					System.out.println("JavaFileFolder create failed");
				}
			} catch (Exception e) {
				e.getStackTrace();
				return "err1";
			}
		}

		path.append("/" + ups.getUserId());
		File UserFolder = new File(path.toString());
		if (!UserFolder.exists()) {
			try {
				if (UserFolder.mkdir()) {
					System.out.println("UserFolder create success");
				} else {
					System.out.println("UserFolder create failed");
				}
			} catch (Exception e) {
				e.getStackTrace();
				return "err2";
			}
		}

		path.append("/" + ups.getProblemName());
		File UserProblemFolder = new File(path.toString());
		if (!UserProblemFolder.exists()) {
			try {
				if (UserProblemFolder.mkdir()) {
					System.out.println("UserProblemFolder create success");
				} else {
					System.out.println("UserProblemFolder create failed");
				}
			} catch (Exception e) {
				e.getStackTrace();
				return "err3";
			}
		}
		return path.toString();
	}

	public static void getProblemSet(String problemName)
			throws UnsupportedEncodingException, JsonMappingException, JsonProcessingException {
		final String uri = "http://127.0.0.1:3100/api/problem";

		String reqBody = "{\"Problem_Name\": " + problemName + "}";
		String rawJson = new String(reqBody.getBytes("UTF-8"), "UTF-8");
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode node = objectMapper.readTree(rawJson);
		RestTemplate restTemplate = new RestTemplate();
		ProblemSet result = restTemplate.postForObject(uri, node, ProblemSet.class);

		System.out.println(result.toString());
	}

	public static void dbServerPost() throws JsonProcessingException {
		try {
			HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
			factory.setConnectTimeout(5000); // 타임아웃 설정 5초
			factory.setReadTimeout(5000);// 타임아웃 설정 5초
			RestTemplate restTemplate = new RestTemplate(factory);
			String url = "http://localhost:3100/api/solve/update";

			UserSolveProblem ups = new UserSolveProblem();
			ups.setProblemName("test");
			ups.setUserId("test sjh");
			ups.setState("Running");
			ups.setSolveCount(1);
			ups.setTotalCount(100);

			restTemplate.postForObject(url, ups, Boolean.class);
		} catch (HttpClientErrorException | HttpServerErrorException e) {
			System.out.println(e.toString());
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}

	@GetMapping("/test")
	public static String testFunction() {
		String res = "testFunction operate";
		String inputCase = "0 1 2 3 4 5 6  7  8  9  10";
		String outputCase = "1 1 2 3 5 8 13 21 34 55 89";
		String url = "http://localhost:3100/api/solve/update";
		PostThread pthread = new PostThread();
		pthread.setUrl(url);
		pthread.setInputCase(inputCase);
		pthread.setOutputCase(outputCase);
		Thread t = new Thread(pthread);
		t.start();

		return res;
	}

	@PostMapping("/compile")
	public static String compileProblem(@RequestBody UserProblemSet ups) {
		String url = "http://localhost:3100/api/solve/update";
		if (ups.getUserId() == null) {
			return "User_Id is null";
		} else if (ups.getProblemName() == null) {
			return "Problem_Name is null";
		} else if (ups.getCode() == null) {
			return "Code is null";
		}

		String path = getPath(ups);
		if (path.substring(0, 3).equals("err")) {
			return "path generating error";
		}

		try {
			FileWriter fw = new FileWriter(path + "/Main.java");
			fw.write(ups.getCode());
			fw.close();

			/*
			 * JavaCompiler compiler = ToolProvider.getSystemJavaCompiler(); int success =
			 * compiler.run(null, null, null, path.toString() + "/Main.java"); if (success
			 * == 0) {
			 * 
			 * int count = 0; String[] input = ups.getProblemInputCase().split(" ");
			 * String[] output = ups.getProblemOutputCase().split(" ");
			 * 
			 * for (int i = 0; i < input.length; i++) { Runtime runtime =
			 * Runtime.getRuntime(); Process p = runtime.exec("java Main", null, new
			 * File(path.toString())); BufferedWriter stdIn = new BufferedWriter(new
			 * OutputStreamWriter(p.getOutputStream())); stdIn.append(input[i] + "\n");
			 * stdIn.flush();
			 * 
			 * BufferedReader stdOut = new BufferedReader(new
			 * InputStreamReader(p.getInputStream())); String str = null; while ((str =
			 * stdOut.readLine()) != null) { if (str.equals(output[i])) { count++; } } }
			 * return "Java file run, Success Count : " + count + ", Total Count : " +
			 * input.length; } else { return "JavaCompiler is not working"; }
			 */
			
			PostThread pthread = new PostThread();
			pthread.setUrl(url);
			pthread.setInputCase(ups.getProblemInputCase());
			pthread.setOutputCase(ups.getProblemOutputCase());
			Thread t = new Thread(pthread);
			t.start();
			
			return "JavaCompiler Thread Start";
		} catch (IOException e) {
			return "JavaCompiler is error";
		}

	}
}
