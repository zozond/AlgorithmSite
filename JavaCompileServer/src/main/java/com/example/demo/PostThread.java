package com.example.demo;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

public class PostThread implements Runnable {

	private String url = "http://localhost:3100/api/solve/update";
	private UserSolveProblem ups = new UserSolveProblem();
	private String inputCase = "";
	private String outputCase = "";
	private String path = "";
	private String pname = "";
	private String userId = "";
	
	public PostThread() {
		// TODO Auto-generated constructor stub
	}
	
	public void setProblemName(String pname) {
		this.pname = pname;
	}
	public void setUserId(String uid) {
		this.userId = uid;
	}
	public void setPath(String path) {
		this.path = path;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}
	
	public void setInputCase(String inputCase) {
		this.inputCase = inputCase;
	}
	
	public void setOutputCase(String outputCase) {
		this.outputCase = outputCase;
	}

	public void setUserSolveProblem(String uid, String pname, String state, int solveCount, int totalCount) {
		ups.setUserId(uid);
		ups.setProblemName(pname);
		ups.setState(state);
		ups.setSolveCount(solveCount);
		ups.setTotalCount(totalCount);
	}

	public void send() {
		try {
			HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
			factory.setConnectTimeout(100000); // 타임아웃 설정 10초
			factory.setReadTimeout(10000);// 타임아웃 설정 10초
			RestTemplate restTemplate = new RestTemplate(factory);
			restTemplate.postForObject(this.url, this.ups, Boolean.class);
		} catch (HttpClientErrorException | HttpServerErrorException e) {
			System.out.println(e.toString());
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}

	@Override
	public void run() {
		try {
			JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
			int success = compiler.run(null, null, null, this.path + "/Main.java");
			if (success == 0) {
				String[] input = this.inputCase.split(" ");
				String[] output = this.outputCase.split(" ");

				for (int i = 0; i < input.length; i++) {
					Runtime runtime = Runtime.getRuntime();
					Process p = runtime.exec("java Main", null, new File(this.path));
					BufferedWriter stdIn = new BufferedWriter(new OutputStreamWriter(p.getOutputStream()));
					stdIn.append(input[i] + "\n");
					stdIn.flush();

					BufferedReader stdOut = new BufferedReader(new InputStreamReader(p.getInputStream()));
					String str = null;
					while ((str = stdOut.readLine()) != null) {
						if (str.equals(output[i])) {
							this.ups.setSolveCount(1);
						}else {
							this.ups.setSolveCount(0);
						}
					}
					if(i == 0) this.ups.setState("start");
					else if( i == input.length-1) this.ups.setState("finish"); 
					else this.ups.setState("running");
					
					this.ups.setProblemName(pname);
					this.ups.setUserId(userId);
					this.ups.setTotalCount(input.length);
					send();
				}
			}
		}catch (Exception e) {
			System.out.println(e.toString());
		}
		
	}
}
